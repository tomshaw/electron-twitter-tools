import * as types from '../mutation-types'
import * as constants from '@/config/constants'
import initialState from './state/search'
import {db, client} from '@/store/connect'
import availableLanguages from '@/config/languages'
import SentimentAnalysis from '@/library/sentiment/bagofwords'

const state = initialState()

const processSentiment = true

const getters = {
  getSearchId: state => state.id,
  getSearchActive: state => state.active,
  getSearchResults: state => state.results,
  getSearchPlaces: state => state.places,
  getSearchSessions: state => state.sessions,
  getSearchLanguages: state => state.languages,
  getSearchTimezones: state => state.timezones,
  getSearchLocations: state => state.locations,
  getSearchInfluential: state => state.influential,
  getSearchSentiment: state => state.sentiment,
  getSearchSentimentWords: state => state.words
}

const mutations = {
  [types.SEARCH_SESSION_ACTIVE] (state, status) {
    state.active = status
  },
  [types.SEARCH_SESSION_SAVE] (state, payload) {
    state.id = payload.id
  },
  [types.SEARCH_SESSION_START] (state, payload) {

    state.results.status_count++

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

    let j = availableLanguages.map(item => item.code).indexOf(payload.lang) 
    let i = state.languages.map(item => item.value).indexOf(payload.lang) 
    if (i === -1) {
      if (j !== -1) {
        let langData = availableLanguages[j]
        state.languages.push({ 
          text: langData.name,
          value: payload.lang,
          counter: 1 
        })
        state.results.language_count = state.languages.length
      }
    } else {
      if (j !== -1) {
        let langData = availableLanguages[j]
        state.languages[i].counter++
        state.languages[i].text = `${langData.name}: ${state.languages[i].counter}`
      }
    }

    if (payload.user.time_zone) {
      let i = state.timezones.map(item => item.value).indexOf(payload.user.time_zone) 
      if (i === -1) {
        state.timezones.push({ 
          text: payload.user.time_zone,
          value: payload.user.time_zone,
          counter: 1 
        })
        state.results.timezone_count = state.timezones.length
      } else {
        state.timezones[i].counter++
        state.timezones[i].text = `${payload.user.time_zone}: ${state.timezones[i].counter}`
      }
    }

    if (payload.place) {
      let i = state.places.map(item => item.value).indexOf(payload.place.full_name) 
      
      if (i === -1) {
        state.places.push({ 
          text: payload.place.full_name,
          value: payload.place.full_name,
          counter: 1 
        })
        state.results.places_count = state.places.length
      } else {
        state.places[i].counter++
        state.places[i].text = `${payload.place.full_name}: ${state.places[i].counter}`
      }
    }

    if (payload.user) {
      let i = state.influential.map(item => item.value).indexOf(payload.user.id_str)
      if (i === -1) {
        if (state.influential.length) {
          if (state.influential[state.influential.length - 1].count < payload.user.followers_count) {
            state.influential.push({ 
              text: `${payload.user.name} @${payload.user.screen_name} #${payload.user.followers_count}`,
              value: payload.user.id_str,
              count: payload.user.followers_count
            })
          }
        } else {
          state.influential.push({ 
            text: `${payload.user.name} ${payload.user.followers_count}`,
            value: payload.user.id_str,
            count: payload.user.followers_count
          })
        }
      }

      if (state.influential.length) {
        state.influential.sort((a, b) => {
          return a.count - b.count;
        }).reverse()
      }

      if (state.influential.length > 10) {
        state.influential.pop()
      }
    }

    const MAX_LOCATION_ITEMS = 10

    if (payload.coordinates) {
      state.locations.unshift({
        latitude: payload.coordinates.coordinates[0],
        longitude: payload.coordinates.coordinates[0]
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
    }

    if (state.locations.length > MAX_LOCATION_ITEMS) {
      state.locations.pop()
    }

    const sentiment = payload.sa
    const bagofwords = sentiment.bagofwords
    const score = bagofwords.score
    const match = bagofwords.match

    if (score < 0) {
      state.sentiment.negative += score
    } else if (score > 0) {
      state.sentiment.positive += score
    } else {
      state.sentiment.neutral++
    }

    if (match.constructor === Array) {
      if (match.length) {
        match.forEach((data) => {
          let {word, value} = data;
          let i = state.words.map(item => item.word).indexOf(word)
          if (i === -1) {
            state.words.push({ 
              word: word,
              value: value,
              count: 1
            })
          } else {
            state.words[i].count++
          }
        })
      }

      if (state.words.length) {
        state.words.sort((a, b) => {
          return a.count - b.count;
        }).reverse()
      }

      if (state.words.length > 30) {
        state.words.pop()
      }

    }

    //console.log('words', state.words)
    //console.log('payload', payload)

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
      const includeReplies = constants.SEARCH_SETTINGS_INCLUDE
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

      if (includeQuotes !== constants.SEARCH_SETTINGS_INCLUDE) {
        if (includeQuotes === constants.SEARCH_SETTINGS_EXCLUDE) {
          excludeQuotes = true
        }
        if (includeQuotes === constants.SEARCH_SETTINGS_LIMITED) {
          limitedQuotes = true
        }
      }

      if (includeReplies !== constants.SEARCH_SETTINGS_INCLUDE) {
        if (includeReplies === constants.SEARCH_SETTINGS_EXCLUDE) {
          excludeReplies = true
        } 
        if (includeReplies === constants.SEARCH_SETTINGS_LIMITED) {
          limitedRetweets = true
        }
      }

      if (includeRetweets !== constants.SEARCH_SETTINGS_INCLUDE) {
        if (includeRetweets === constants.SEARCH_SETTINGS_EXCLUDE) {
          excludeRetweets = true
        } 
        if (includeRetweets === constants.SEARCH_SETTINGS_LIMITED) {
          limitedRetweets = true
        }
      }

      if (includeVerified !== constants.SEARCH_SETTINGS_INCLUDE) {
        if (includeVerified === constants.SEARCH_SETTINGS_EXCLUDE) {
          excludeVerified = true
        } 
        if (includeVerified === constants.SEARCH_SETTINGS_LIMITED) {
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

      if (response.place) {
        save.place_coordinates = JSON.stringify(response.place.bounding_box.coordinates)
        save.place_type = response.place.place_type
        save.place_country = response.place.country
        save.place_country_code = response.place.country_code
        save.place_name = response.place.name
        save.place_full_name = response.place.full_name
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

      response.sa = {}

      if (processSentiment) {
        response.sa.bagofwords = new SentimentAnalysis(response.text)
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
        console.log('dberror', error)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
