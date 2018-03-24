import * as types from '../mutation-types'
import {client} from '@/store/connect'

const state = {
  validated: false, 
  profile: {
    id: '',
    name: '',
    screen_name: '',
    description: '',
    friends_count: 0,
    followers_count: 0,
    statuses_count: 0,
    favourites_count: 0,
    profile_image_url: '',
    profile_background_image_url: ''
  }
}

const getters = {
  getAccountValidated: state => state.validated,
  getTwitterProfile: state => state.profile
}

const mutations = {
  [types.TWITTER_SET_VALIDATED] (state, status) {
    state.validated = status
  },
  [types.TWITTER_SET_PROFILE] (state, payload) {
    state.profile = payload
  },
  [types.TWITTER_UPDATE_PROFILE] (state, payload) {
    // state.profile = payload
    console.log('payload', payload)
    state.profile = Object.assign({}, {
      id: payload.id_str,
      name: payload.name,
      screen_name: payload.screen_name,
      description: payload.description,
      friends_count: payload.friends_count,
      followers_count: payload.followers_count,
      statuses_count: payload.statuses_count,
      favourites_count: payload.favourites_count,
      profile_image_url: payload.profile_image_url,
      profile_background_image_url: payload.profile_background_image_url
    })
  },
  [types.TWITTER_SET_FRIENDS_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.profile.friends_count++
    } else if (payload.type === 'decrement') {
      state.profile.friends_count--
    }
    state.profile = Object.assign({}, state.profile)
  },
  [types.TWITTER_SET_FOLLOWERS_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.profile.followers_count++
    } else if (payload.type === 'decrement') {
      state.profile.followers_count--
    }
    state.profile = Object.assign({}, state.profile)
  },
  [types.TWITTER_SET_STATUSES_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.profile.statuses_count++
    } else if (payload.type === 'decrement') {
      state.profile.statuses_count--
    }
    state.profile = Object.assign({}, state.profile)
  },
  [types.TWITTER_SET_FAVORITES_COUNT] (state, payload) {
    if (payload.type === 'increment') {
      state.profile.favourites_count++
    } else if (payload.type === 'decrement') {
      state.profile.favourites_count--
    }
    state.profile = Object.assign({}, state.profile)
  }
}

const actions = {
  setValidated: ({commit}, status) => {
    commit(types.TWITTER_SET_VALIDATED, status)
  },
  loadProfile({ commit }) {
    return new Promise((resolve, reject) => {
      client.verifyCredentials(payload => {
        commit(types.TWITTER_UPDATE_PROFILE, payload)
        resolve(payload)
      })
    })
  },
  setProfile: ({commit}, payload) => {
    commit(types.TWITTER_SET_PROFILE, payload)
  },
  setFriendsCount: ({commit}, payload) => {
    commit(types.TWITTER_SET_FRIENDS_COUNT, payload)
  },
  setFollowersCount: ({commit}, payload) => {
    commit(types.TWITTER_SET_FOLLOWERS_COUNT, payload)
  },
  setStatusesCount: ({commit}, payload) => {
    commit(types.TWITTER_SET_STATUSES_COUNT, payload)
  },
  setFavoritesCount: ({commit}, payload) => {
    commit(types.TWITTER_SET_FAVORITES_COUNT, payload)
  }
}

export default {
  state, mutations, actions, getters
}
