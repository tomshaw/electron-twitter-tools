import * as types from '../mutation-types'
import {client} from '@/store/connect'

const state = {
  validated: false, 
  credentials: {},
  settings: {}
}

const getters = {
  getAccountValidated: state => state.validated,
  getAccountCredentials: state => state.credentials,
  getAccountSettings: state => state.settings
}

const mutations = {
  [types.TWITTER_UPDATE_VALIDATED] (state, status) {
    state.validated = status
  },
  [types.TWITTER_UPDATE_CREDENTIALS] (state, payload) {
    state.credentials = Object.assign({}, payload)
  },
  [types.TWITTER_UPDATE_SETTINGS] (state, payload) {
    state.settings = {...state.settings, ...payload}
  },
  [types.TWITTER_SET_FRIENDS_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.credentials.friends_count++
    } else if (payload.type === 'decrement') {
      state.credentials.friends_count--
    }
    state.credentials = Object.assign({}, state.credentials)
  },
  [types.TWITTER_SET_FOLLOWERS_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.credentials.followers_count++
    } else if (payload.type === 'decrement') {
      state.credentials.followers_count--
    }
    state.credentials = Object.assign({}, state.credentials)
  },
  [types.TWITTER_SET_STATUSES_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.credentials.statuses_count++
    } else if (payload.type === 'decrement') {
      state.credentials.statuses_count--
    }
    state.credentials = Object.assign({}, state.credentials)
  },
  [types.TWITTER_SET_FAVORITES_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.credentials.favourites_count++
    } else if (payload.type === 'decrement') {
      state.credentials.favourites_count--
    }
    state.credentials = Object.assign({}, state.credentials)
  }
}

const actions = {
  accountCredentials({ commit }) {
    return new Promise((resolve, reject) => {
      client.verifyCredentials(payload => {
        commit(types.TWITTER_UPDATE_CREDENTIALS, payload)
        resolve(payload)
      })
    })
  },
  accountSettings({ commit }) {
    return new Promise((resolve, reject) => {
      client.accountSettings(payload => {
        commit(types.TWITTER_UPDATE_SETTINGS, payload)
        resolve(payload)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
