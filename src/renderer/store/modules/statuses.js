import * as types from '../mutation-types'
import {client} from '@/store/connect'

const STATUS_MAX_ITEMS = 20

const state = {
  home: [],
  user: [],
  favs: []
}

const getters = {
  getStatusHome: state => state.home,
  getStatusUser: state => state.user,
  getStatusFavs: state => state.favs
}

const mutations = {
  [types.STATUS_TIMELINE_LOAD_HOME](state, payload) {
    state.home = []
    payload.forEach((item) => {
      state.home.push(item)
    })
    if (state.home.length > STATUS_MAX_ITEMS) {
      let diff = state.home.length - STATUS_MAX_ITEMS
      state.home.splice(STATUS_MAX_ITEMS, diff)
    }
  },
  [types.STATUS_TIMELINE_STREAM_HOME](state, payload) {
    state.home.unshift(payload)
    if (state.home.length > STATUS_MAX_ITEMS) {
      let diff = state.home.length - STATUS_MAX_ITEMS
      state.home.splice(STATUS_MAX_ITEMS, diff)
    }
  },
  [types.STATUS_TIMELINE_LOAD_USER](state, payload) {
    state.user = []
    payload.forEach((item) => {
      state.user.push(item)
    })
    if (state.user.length > STATUS_MAX_ITEMS) {
      let diff = state.user.length - STATUS_MAX_ITEMS
      state.user.splice(STATUS_MAX_ITEMS, diff)
    }
  },
  [types.STATUS_TIMELINE_LOAD_FAVS](state, payload) {
    state.favs = []
    payload.forEach((item) => {
      state.favs.push(item)
    })
    if (state.favs.length > STATUS_MAX_ITEMS) {
      let diff = state.favs.length - STATUS_MAX_ITEMS
      state.favs.splice(STATUS_MAX_ITEMS, diff)
    }
  },
  [types.STATUS_TWEET_DESTROY](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx !== -1) {
      state.home.splice(homeIdx, 1)
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx !== -1) {
      state.user.splice(userIdx, 1)
    }
  },
  [types.STATUS_RETWEET_CREATE](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx !== -1) {
      state.home[homeIdx].retweeted = true
    }
    state.user.unshift(payload)
  },
  [types.STATUS_RETWEET_DESTROY](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx !== -1) {
      state.home[homeIdx].retweeted = false
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx !== -1) {
      state.user.splice(userIdx, 1)
    }
  },
  [types.STATUS_FAVORITES_CREATE](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx !== -1) {
      state.home[homeIdx].favorited = true
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx !== -1) {
      state.user[userIdx].favorited = true
    }
    state.favs.unshift(payload)
  },
  [types.STATUS_FAVORITES_DESTROY](state, payload) {
    let i = state.favs.map(item => item.id_str).indexOf(payload.id_str) 
    state.favs.splice(i, 1)
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx !== -1) {
      state.home[homeIdx].favorited = false
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx !== -1) {
      state.user[userIdx].favorited = false
    }
  }
}

const actions = {
  loadStatusHome({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.homeTimeline(options).then(resp => {
        commit(types.STATUS_TIMELINE_LOAD_HOME, resp)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  streamStatusHome({ commit }) {
    return new Promise((resolve, reject) => {
      client.streamFilter('user', {}, resp => {
        commit(types.STATUS_TIMELINE_STREAM_HOME, resp)
        resolve(resp)
      })
    })
  },
  loadStatusUser({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.userTimeline(options).then(resp => {
        commit(types.STATUS_TIMELINE_LOAD_USER, resp)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  loadStatusFavs({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.favoritesList(options).then(resp => {
        commit(types.STATUS_TIMELINE_LOAD_FAVS, resp)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  statusDestroy({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postStatusDestroy({id: options.id_str}).then(resp => {
        commit(types.TWITTER_SET_STATUSES_COUNT, {type: 'decrement'})
        commit(types.STATUS_TWEET_DESTROY, resp)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  retweetCreate({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postRetweet({id: options.id_str}).then(resp => {
        commit(types.TWITTER_SET_STATUSES_COUNT, {type: 'increment'})
        commit(types.STATUS_RETWEET_CREATE, options)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  retweetDestroy({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postUnretweet({id: options.id_str}).then(resp => {
        commit(types.TWITTER_SET_STATUSES_COUNT, {type: 'decrement'})
        commit(types.STATUS_RETWEET_DESTROY, options)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  favoriteCreate({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postFavoritesCreate({id: options.id_str}).then(resp => {
        commit(types.TWITTER_SET_FAVORITES_COUNT, {type: 'increment'})
        commit(types.STATUS_FAVORITES_CREATE, options)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  favoriteDestroy({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postFavoritesDestroy({id: options.id_str}).then(resp => {
        commit(types.TWITTER_SET_FAVORITES_COUNT, {type: 'decrement'})
        commit(types.STATUS_FAVORITES_DESTROY, options)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
