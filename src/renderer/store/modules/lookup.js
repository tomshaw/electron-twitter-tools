import * as types from '../mutation-types'
import Twitter from '@/library/twitter'
const settings = require('electron-settings')

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(settings.get('twitter.tokens'))
  }
  return client
}

const client = getClient()

const state = {
  items: [],
  users: []
}

const getters = {
  getLookupItems: state => state.items,
  getLookupUsers: state => state.users
}

const mutations = {
  [types.LOOKUP_USERS_SEARCH] (state, payload) {
    state.items = []
    state.items = payload
  },
  [types.LOOKUP_USERS_LOOKUP] (state, payload) {
    state.users = []
    state.users = payload
  },
  [types.LOOKUP_USERS_REMOVE](state, payload) {
    let i = state.users.map(item => item.id_str).indexOf(payload.value)
    if (i !== -1) { /* error */
      state.users.splice(i, 1)
    }
  },
  [types.LOOKUP_USERS_FRIENDSHIP](state, payload) {
    let userIdx = state.users.map(item => item.id_str).indexOf(payload.id)
    if (userIdx !== -1) { /* error */
      state.users[userIdx].following = payload.value
    }
  },
  [types.LOOKUP_USERS_CLEAR](state) {
    state.users = []
  }
}

const actions = {
  searchUsers: ({commit}, options) => {
    return new Promise((resolve, reject) => {
      client.searchUsers(options, (payload) => {
        let items = []
        if (payload.length) {
          payload.forEach(tweet => {
            items.push({
              value: tweet.id_str,
              text: tweet.name,
              description: tweet.description,
              avatar: tweet.profile_image_url
            })
          })
        }
        commit(types.LOOKUP_USERS_SEARCH, items)
        resolve()
      })
    })
  },
  lookupUsers: ({commit}, options) => {
    return new Promise((resolve, reject) => {
      client.lookupUsers(options, (payload) => {
        commit(types.LOOKUP_USERS_LOOKUP, payload)
        resolve()
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
