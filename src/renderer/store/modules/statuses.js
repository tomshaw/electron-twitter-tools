import * as types from '../mutation-types'
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
    if (state.home.length > 50) {
      state.home.pop()
    }
    state.home.push(payload)
  },
  [types.STATUS_TIMELINE_STREAM_HOME](state, payload) {
    if (state.home.length > 50) {
      state.home.pop()
    }
    let newState = Object.assign({}, payload)
    state.home.unshift(newState)
    //state.home = [...state.home, payload]
  },
  [types.STATUS_TIMELINE_LOAD_USER](state, payload) {
    if (state.user.length > 50) {
      state.user.pop()
    }
    state.user.push(payload)
  },
  [types.STATUS_TIMELINE_LOAD_FAVS](state, payload) {
    if (state.favs.length > 50) {
      state.favs.pop()
    }
    state.favs.push(payload) // unshift
  },
  [types.STATUS_TWEET_DESTROY](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx > 0) {
      state.home[homeIdx].retweeted = false
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx > 0) {
      state.user[userIdx].retweeted = false
    }
  },
  [types.STATUS_RETWEET_CREATE](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx > 0) {
      state.home[homeIdx].retweeted = true
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx > 0) {
      state.user[userIdx].retweeted = true
    } else {
      state.user.push(payload)
    }
  },
  [types.STATUS_RETWEET_DESTROY](state, payload) {
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx > 0) {
      state.home[homeIdx].retweeted = false
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    console.log('userIdx', userIdx)
    if (userIdx > 0) {
      state.user[userIdx].retweeted = false
    }
  },
  [types.STATUS_FAVORITES_CREATE](state, payload) {
    state.favs.push(payload)
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx > 0) {
      state.home[homeIdx].favorited = true
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx > 0) {
      state.user[userIdx].favorited = true
    }
  },
  [types.STATUS_FAVORITES_DESTROY](state, payload) {
    let i = state.favs.map(item => item.id_str).indexOf(payload.id_str) 
    state.favs.splice(i, 1)
    let homeIdx = state.home.map(item => item.id_str).indexOf(payload.id_str)
    if (homeIdx > 0) {
      state.home[homeIdx].favorited = false
    }
    let userIdx = state.user.map(item => item.id_str).indexOf(payload.id_str)
    if (userIdx > 0) {
      state.user[userIdx].favorited = false
    }
  }
}

const actions = {
  loadStatusHome({ commit }) {
    return new Promise((resolve, reject) => {
      client.homeTimeline(payload => {
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
    const options = {screen_name: account.screen_name}
    client.userTimeline(options, payload => {
      commit(types.STATUS_TIMELINE_LOAD_USER, payload)
    })
  },
  loadStatusFavs({ commit }) {
    client.favoritesList(account, payload => {
      commit(types.STATUS_TIMELINE_LOAD_FAVS, payload)
    })
  },
  statusDestroy({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postStatusDestroy(tweet, payload => {
        commit(types.STATUS_TWEET_DESTROY, tweet)
        resolve()
      })
    })
  },
  retweetCreate({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postRetweet(tweet, payload => {
        commit(types.STATUS_RETWEET_CREATE, tweet)
        resolve()
      })
    })
  },
  retweetDestroy({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postUnretweet(tweet, payload => {
        commit(types.STATUS_RETWEET_DESTROY, tweet)
        resolve()
      })
    })
  },
  favoriteCreate({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postFavoritesCreate(tweet, payload => {
        commit(types.STATUS_FAVORITES_CREATE, payload)
        resolve()
      })
    })
  },
  favoriteDestroy({ commit }, tweet) {
    return new Promise((resolve, reject) => {
      client.postFavoritesDestroy(tweet, payload => {
        commit(types.STATUS_FAVORITES_DESTROY, payload)
        resolve()
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
