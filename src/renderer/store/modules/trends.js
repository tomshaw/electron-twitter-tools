import * as types from '../mutation-types'
import {client} from '@/store/connect'

const state = {
  dialog: false,
  woeid: 2477058,
  available: [],
  closest: [],
  place: [],
  items: []
}

const getters = {
  getTrendingDialog: state => state.dialog,
  getTrendingAvailable: state => state.available,
  getTrendingClosest: state => state.closest,
  getTrendingPlace: state => state.place,
  getTrendingItems: state => state.items
}

const mutations = {
  [types.TRENDS_MODAL_DIALOG] (state, status) {
    state.dialog = status
  },
  [types.TRENDS_LOAD_AVAILABLE] (state, payload) {
    state.available = payload
  },
  [types.TRENDS_LOAD_CLOSEST] (state, payload) {
    state.closet = payload
  },
  [types.TRENDS_LOAD_PLACE] (state, payload) {
    state.place = payload
  }
}

const actions = {
  loadTrendsAvailable: ({commit}, options) => {
    return new Promise((resolve, reject) => {
      client.trendsAvailable(options, response => {
        if (typeof response !== 'undefined') {
          if (response.length) {
            commit(types.TRENDS_LOAD_AVAILABLE, response)
            resolve(response)
          }
        }
      })
    })
  },
  loadTrendsClosest: ({commit}, options) => {
    return new Promise((resolve, reject) => {
      client.trendsClosest(options, response => {
        if (typeof response !== 'undefined') {
          if (response.length) {
            commit(types.TRENDS_LOAD_CLOSEST, response)
            resolve(response)
          }
        }
      })
    })
  },
  loadTrendsPlace: ({commit}, options) => {
    return new Promise((resolve, reject) => {
      client.trendsPlace(options, response => {
        if (typeof response !== 'undefined') {
          if (response.length) {
            commit(types.TRENDS_LOAD_PLACE, response[0].trends)
            resolve(response)
          }
        }
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
