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
// const account = settings.get('twitter.profile')

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
    client.trendsAvailable(options, response => {
      if (typeof response !== 'undefined') {
        if (response.length) {
          commit(types.TRENDS_LOAD_AVAILABLE, response)
        }
      }
    })
  },
  loadTrendsClosest: ({commit}, options) => {
    client.trendsClosest(options, response => {
      if (typeof response !== 'undefined') {
        if (response.length) {
          commit(types.TRENDS_LOAD_CLOSEST, response)
        }
      }
    })
  },
  loadTrendsPlace: ({commit}, options) => {
    client.trendsPlace(options, response => {
      if (typeof response !== 'undefined') {
        if (response.length) {
          commit(types.TRENDS_LOAD_PLACE, response[0].trends)
        }
      }
    })
  }
}

export default {
  state, mutations, actions, getters
}
