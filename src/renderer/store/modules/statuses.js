import * as types from '../mutation-types'
import {client, account} from '@/store/connect'

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
    const id = payload.id_str
    console.log(id, id)
    let homeIdx = state.home.map(item => item.id_str).indexOf(id)
    if (homeIdx !== -1) {
      state.home[homeIdx].retweeted = true
    }
    state.user = [payload, ...state.user]
  },
  [types.STATUS_RETWEET_DESTROY](state, payload) {
    const id = payload.id_str
    console.log(id, id)
    let homeIdx = state.home.map(item => item.id_str).indexOf(id)
    if (homeIdx !== -1) {
      state.home[homeIdx].retweeted = false
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(id)
    if (userIdx !== -1) {
      state.user.splice(userIdx, 1)
    }
  },
  [types.STATUS_FAVORITES_CREATE](state, payload) {
    state.favs = [payload, ...state.favs]
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx !== -1) {
      state.home[homeIdx].favorited = true
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx !== -1) {
      state.user[userIdx].favorited = true
    }
  },
  [types.STATUS_FAVORITES_DESTROY](state, payload) {
    let i = state.favs.map(item => item.id_str).indexOf(payload.id) 
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
  loadStatusHome({ commit }) {
    return new Promise((resolve, reject) => {
      const options = {count: 20, include_entities: true}
      client.homeTimeline(options, payload => {
        commit(types.STATUS_TIMELINE_LOAD_HOME, payload)
        resolve(payload)
      })
    })
  },
  streamStatusHome({ commit }) {
    return new Promise((resolve, reject) => {
      client.streamFilter('user', {}, payload => {
        commit(types.STATUS_TIMELINE_STREAM_HOME, payload)
        resolve(payload)
      })
    })
  },
  loadStatusUser({ commit }) {
    return new Promise((resolve, reject) => {
      const options = {screen_name: account.screen_name}
      client.userTimeline(options, payload => {
        console.log('payload', payload)
        commit(types.STATUS_TIMELINE_LOAD_USER, payload)
        resolve(payload)
      })
    })
  },
  loadStatusFavs({ commit }) {
    return new Promise((resolve, reject) => {
      const options = {screen_name: account.screen_name}
      client.favoritesList(options, payload => {
        commit(types.STATUS_TIMELINE_LOAD_FAVS, payload)
        resolve(payload)
      })
    })
  },
  statusDestroy({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      const options = {id: tweet.id_str}
      client.postStatusDestroy(options, payload => {
        commit(types.STATUS_TWEET_DESTROY, tweet)
        resolve()
      })
    })
  },
  retweetCreate({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      const options = {id: tweet.id_str}
      client.postRetweet(options, payload => {
        commit(types.STATUS_RETWEET_CREATE, payload)
        resolve(payload)
      })
    })
  },
  retweetDestroy({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      const options = {id: tweet.id_str}
      client.postUnretweet(options, payload => {
        commit(types.STATUS_RETWEET_DESTROY, {id_str: tweet.id_str})
        resolve(payload)
      })
    })
  },
  favoriteCreate({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      const options = {id: tweet.id_str}
      client.postFavoritesCreate(options, payload => {
        commit(types.STATUS_FAVORITES_CREATE, tweet)
        resolve(payload)
      })
    })
  },
  favoriteDestroy({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      const options = {id: tweet.id_str}
      client.postFavoritesDestroy(options, payload => {
        commit(types.STATUS_FAVORITES_DESTROY, tweet)
        resolve(payload)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
