import {
  SEARCH_SETTINGS_INCLUDE,
  SEARCH_SETTINGS_EXCLUDE,
  SEARCH_SETTINGS_LIMITED
} from '@/config/constants'
import * as types from '../mutation-types'
import initialState from './state/search'
import Database from '@/library/storage'
import Twitter from '@/library/twitter'
import availableLanguages from '@/config/languages'
import SentimentAnalysis from '@/library/sentiment/bagofwords'
const settings = require('electron-settings')

function getDb () {
  let db
  if (db === undefined) {
    db = new Database(settings.get('storage.connection'))
  }
  return db
}

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(settings.get('twitter.tokens'))
  }
  return client
}

const db = getDb()
const client = getClient()

const state = initialState()

const processSentiment = true

const getters = {
  getSearchId: state => state.id,
  getSearchActive: state => state.active,
  getSearchResults: state => state.results,
  getSearchSessions: state => state.sessions,
  getSearchLanguages: state => state.languages,
  getSearchLocations: state => state.locations,
  getSearchSentiment: state => state.sentiment
}

const mutations = {
  [types.SEARCH_SESSION_ACTIVE] (state, status) {
    state.active = status
  },
  [types.SEARCH_SESSION_SAVE] (state, payload) {
    state.id = payload.id
  },
  [types.SEARCH_SESSION_START] (state, payload) {

    if (payload.quoted_status) {
      state.results.quote_count++
    }
    
    if (payload.in_reply_to_user_id) {
      state.results.reply_count++
    }

    // if (payload.text.match(/RT @/i)) { /* retweeted */
    // if (payload.text.substring(0, 2) === 'RT') {
    if (payload.extended_tweet) {
      state.results.retweet_count++
    }

    if (payload.user) {
      if (payload.user.verified) {
        state.results.verified_count++
      }
    }

    let hasLang = state.languages.map(item => item.value).indexOf(payload.lang) 
    if (hasLang === -1) {
      let langIdx = availableLanguages.map(item => item.code).indexOf(payload.lang) 
      if (langIdx !== -1) {
        let langData = availableLanguages[langIdx]
        state.languages.push({ 
          text: langData.name,
          value: payload.lang 
        })
        state.results.language_count = state.languages.length
      }
    }

    const MAX_LOCATION_ITEMS = 10

    if (payload.coordinates) {
      state.locations.unshift({
        latitude: payload.coordinates.coordinates[0],
        longitude: payload.coordinates.coordinates[0]
      })
    }

    if (payload.geo) {
      state.locations.unshift({
        latitude: payload.geo.coordinates[0],
        longitude: payload.geo.coordinates[0]
      })
    }

    if (payload.place && payload.user) {
      let coordinates = payload.place.bounding_box.coordinates[0][0]
      state.locations.unshift({
        latitude: coordinates[1],
        longitude: coordinates[0],
        place: {
          full_name: payload.place.full_name,
          country: payload.place.country,
          time_zone: payload.user.time_zone
        },
        user: {
          name: payload.user.name,
          screen_name: payload.user.screen_name,
          image: payload.user.profile_image_url,
          background: payload.user.profile_background_image_url,
          description: payload.user.description
        }
      })
      // console.log('state.place', payload.place.bounding_box.coordinates[0][0])
    }

    if (state.locations.length > MAX_LOCATION_ITEMS) {
      state.locations.pop()
    }

    const score = payload.score

    if (score < 0) {
      state.sentiment.negative += score
    } else if (score > 0) {
      state.sentiment.positive += score
    } else {
      state.sentiment.neutral++
    }

    // console.log('state.sentiment', state)

    state.results.status_count++
  },
  [types.SEARCH_SESSION_END] (state) {
    Object.assign(state, initialState())
  },
  [types.SEARCH_SESSION_GRID] (state, payload) {
    state.sessions = []
    payload.forEach((item) => {
      state.sessions.push(item)
    })
  },
  [types.SEARCH_SESSION_UPDATE](state, data) {
    let savedIdx = state.sessions.map(item => item.id).indexOf(data.id) 
    if (savedIdx !== -1) {
      state.sessions[savedIdx].title = data.title
    }
  },
  [types.SEARCH_SESSION_DELETE](state, id) {
    let i = state.sessions.map(item => item.id).indexOf(id) 
    state.sessions.splice(i, 1)
  }
}

const actions = {
  loadSearchSessions({ commit }) {
    let select = db.api.select('search.id', 'search.title', 'search.keyword', 'search.start_time', 'search.end_time', 'search_store.lang')
      .from('search')
      .count('search_store.id AS tweet_count')
      .leftJoin('search_store', 'search.id', 'search_store.session_id')
      .groupBy('search.id')
      .orderBy('search.id', 'ASC')
    select.then(rows => {
      commit(types.SEARCH_SESSION_GRID, rows)
    })
  },
  updateSearchSession({ commit }, data) {
    db.api('search').update('title', data.title).where('id', '=', data.id).then((resp) => {
      commit(types.SEARCH_SESSION_UPDATE, data)
    })
  },
  deleteSearchSession({ commit }, id) {
    db.api('search').where('id', id).del().then((resp) => {
      db.api('search_store').where('session_id', id).del().then((resp) => {
        commit(types.SEARCH_SESSION_DELETE, id)
      })
    })
  },
  searchSave: ({commit}, options) => {
    return new Promise((resolve, reject) => {
      let save = Object.assign({}, options)
      save.start_time = db.api.fn.now()
      if (save.include_language !== false) {
        if (save.include_language.constructor === Array) {
          save.include_language = JSON.stringify(save.include_language)
        }
      }
      db.api('search').insert([save]).returning('id').then(response => {
        commit(types.SEARCH_SESSION_SAVE, {id: response[0]})
        resolve(options)
      })
    })
  },
  streamStart: ({commit}, options) => {
    client.search(options, (response) => {
      let process = true

      const lang = response.lang

      const isQuote = response.quoted_status
      const isReply = response.in_reply_to_status_id
      const isRetweet = response.retweeted
      const isVerified = response.user.verified

      const includeQuotes = options.include_quotes
      const includeReplies = SEARCH_SETTINGS_INCLUDE
      const includeRetweets = options.include_retweets
      const includeVerified = options.verified_accounts

      let excludeQuotes = false
      let excludeReplies = false
      let excludeRetweets = false
      let excludeVerified = false

      let limitedQuotes = false
      let limitedReplies = false
      let limitedRetweets = false
      let limitedVerified = false

      if (includeQuotes !== SEARCH_SETTINGS_INCLUDE) {
        if (includeQuotes === SEARCH_SETTINGS_EXCLUDE) {
          excludeQuotes = true
        }
        if (includeQuotes === SEARCH_SETTINGS_LIMITED) {
          limitedQuotes = true
        }
      }

      if (includeReplies !== SEARCH_SETTINGS_INCLUDE) {
        if (includeReplies === SEARCH_SETTINGS_EXCLUDE) {
          excludeReplies = true
        } 
        if (includeReplies === SEARCH_SETTINGS_LIMITED) {
          limitedRetweets = true
        }
      }

      if (includeRetweets !== SEARCH_SETTINGS_INCLUDE) {
        if (includeRetweets === SEARCH_SETTINGS_EXCLUDE) {
          excludeRetweets = true
        } 
        if (includeRetweets === SEARCH_SETTINGS_LIMITED) {
          limitedRetweets = true
        }
      }

      if (includeVerified !== SEARCH_SETTINGS_INCLUDE) {
        if (includeVerified === SEARCH_SETTINGS_EXCLUDE) {
          excludeVerified = true
        } 
        if (includeVerified === SEARCH_SETTINGS_LIMITED) {
          limitedVerified = true
        }
      }

      if (excludeQuotes) {
        if (isQuote) {
          process = false
        }
      }

      if (excludeReplies) {
        if (isReply) {
          process = false
        }
      }

      if (excludeRetweets) {
        if (isRetweet) {
          process = false
        }
      }

      if (excludeVerified) {
        if (isVerified) {
          process = false
        }
      }

      if (limitedQuotes) {
        if (!isQuote) {
          process = false
        }
      }

      if (limitedReplies) {
        if (!isReply) {
          process = false
        }
      }

      if (limitedRetweets) {
        if (!isRetweet) {
          process = false
        }
      }

      if (limitedVerified) {
        if (!isVerified) {
          process = false
        }
      }

      if (options.include_language) {
        if (options.include_language.constructor === Array) {
          let langFound = options.include_language.map((item, i) => item).indexOf(lang)
          if (langFound === -1) {
            process = false
          }
        }
      }

      let save = {
        session_id: state.id
      }

      if (response.coordinates) {
        save.coordinates_type = response.coordinates.type
        save.coordinates_lat = response.coordinates.coordinates[0]
        save.coordinates_lng = response.coordinates.coordinates[1]
      }

      if (response.geo) {
        save.geo_type = response.geo.type
        save.geo_lat = response.geo.coordinates[1]
        save.geo_lng = response.geo.coordinates[0]
      }

      save.favorite_count = response.favorite_count
      save.filter_level = response.filter_level
      save.tweet_id = response.id_str
      save.is_reply = (response.in_reply_to_status_id) ? 1 : 0
      save.is_quote = response.is_quote_status ? 1 : 0
      save.lang = response.lang
      save.possibly_sensitive = response.possibly_sensitive
      save.quote_count = response.quote_count
      save.reply_count = response.reply_count
      save.retweet_count = response.retweet_count
      save.text = response.text.replace(/[\u0800-\uFFFF]/g, '')
      //user info
      save.user_id = response.user.id_str
      save.name = response.user.name.replace(/[\u0800-\uFFFF]/g, '')
      save.screen_name = response.user.screen_name
      save.description = response.user.description.replace(/[\u0800-\uFFFF]/g, '')
      save.user_default_profile = response.user.default_profile
      save.user_default_profile_image = response.user.default_profile_image
      save.profile_background_image_url = response.user.profile_background_image_url
      save.statuses_count = response.user.statuses_count
      save.favourites_count = response.user.favourites_count
      save.followers_count = response.user.followers_count
      save.friends_count = response.user.friends_count
      save.listed_count = response.user.listed_count
      save.location = response.user.location.replace(/[\u0800-\uFFFF]/g, '')
      save.protected = response.user.protected
      save.time_zone = response.user.time_zone
      save.verified = response.user.verified
      save.created_at = db.api.fn.now()

      // console.log('save', save)

      if (processSentiment) {
        let results = new SentimentAnalysis(response.text)
        response.score = results.score
      }

      if (process === true) {
        db.api('search_store').insert([save]).returning('id').then(resp => {
          commit(types.SEARCH_SESSION_START, response)
        }).catch(error => {
          console.log('error', error)
        })
      }
    })
  },
  streamEnd: ({commit}) => {
    const done = (next) => {
      if (client.stream) {
        client.stream.destroy()
      }
      next()
    }
    done(() => {
      db.api('search').update('end_time', db.api.fn.now()).where('id', '=', state.id).then((resp) => {
        commit(types.SEARCH_SESSION_END)
      }).catch(error => {
        console.log('error!!', error)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
