import * as types from '../mutation-types'
import bigInt from 'big-integer'
import Twitter from '@/library/twitter'
const settings = require('electron-settings')
const account = settings.get('twitter.profile')

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(settings.get('twitter.tokens'))
  }
  return client
}

const client = getClient()

const state = {
  tweets: [],
  favorites: [],
  selected: []
}

const getters = {
  getExpungeTweets: state => state.tweets,
  getExpungeFavorites: state => state.favorites,
  getExpungeSelectedItems: state => state.selected,
  getExpungeSelectedCount: state => state.selected.length
}

const mutations = {
  [types.EXPUNGE_LOAD_TWEETS](state, payload) {
    state.tweets.push(payload)
  },
  [types.EXPUNGE_LOAD_FAVORITES](state, payload) {
    state.favorites.push(payload)
  },
  [types.EXPUNGE_RESET_TWEETS](state, payload) {
    state.tweets = []
  },
  [types.EXPUNGE_RESET_FAVORITES](state, payload) {
    state.favorites = []
  },
  [types.EXPUNGE_DESTROY_TWEET](state, payload) {
    let i = state.tweets.map(item => item.id_str).indexOf(payload.id_str) 
    state.tweets.splice(i, 1)
  },
  [types.EXPUNGE_DESTROY_FAVORITE](state, payload) {
    let i = state.favorites.map(item => item.id_str).indexOf(payload.id_str) 
    state.favorites.splice(i, 1)
  },
  [types.EXPUNGE_SET_SELECTED](state, payload) {
    state.selected.push(payload)
  },
  [types.EXPUNGE_RESET_SELECTED](state, payload) {
    state.selected = []
  }
}

const actions = {
  loadStatuses({ commit }, type) {

    return new Promise((resolve, reject) => {

      let finished = 0
      let endPoint = (type === 'tweets') ? 'statuses/user_timeline' : 'favorites/list'
      let commitType = (type === 'tweets') ? types.EXPUNGE_LOAD_TWEETS : types.EXPUNGE_LOAD_FAVORITES
      let options = { count: 50, screen_name: account.screen_name, include_rts: true, trim_user: true }

      let totalStatuses = (type === 'tweets') ? account.statuses_count : account.favourites_count

      const initialize = (next) => {
        let counter = 0
        client.api.get(endPoint, options, (error, data, response) => {

          if (Object.keys(data).length === 0) {
            commit(types.TASKS_RESET_PROGRESS)
            next()
          }

          if (!error && Object.keys(data).length > 0) {
            data.forEach(tweet => {
              commit(commitType, { id: tweet.id_str, text: tweet.text, entities: tweet.entities, retweeted: tweet.retweeted, created_at: tweet.created_at })
              let done = finished++
              commit(types.TASKS_SET_PROGRESS, { id: 'expunge', name: type, total: totalStatuses, done: done })
              counter++
            })

            options.max_id = bigInt(data[counter - 1].id_str).subtract(1).toString()

            setTimeout(initialize(next), 1e3)
          } else {
            if (error) {
              console.log('ERROR', error)
              setTimeout(initialize(next), 1e3)
            }
          }
        })
      }

      initialize(() => {
        resolve()
      })
    })
  },
  expungeTweet({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postStatusDestroy(tweet, payload => {
        commit(types.EXPUNGE_DESTROY_TWEET, payload)
        resolve()
      })
    })
  },
  expungeFavorite({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postFavoritesDestroy(tweet, payload => {
        commit(types.EXPUNGE_DESTROY_TWEET, payload)
        resolve()
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
