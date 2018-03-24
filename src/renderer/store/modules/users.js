import * as types from '../mutation-types'
import {client, account} from '@/store/connect'

const state = {
  friends: [],
  followers: []
}

const getters = {
  getFriends: state => state.friends,
  getFollowers: state => state.followers
}

const mutations = {
  [types.TWITTER_USERS_LOAD_FRIENDS](state, payload) {
    state.friends = []
    payload.forEach(item => {
      state.friends.push(item)
    })
  },
  [types.TWITTER_USERS_LOAD_FOLLOWERS](state, payload) {
    state.followers = []
    payload.forEach(item => {
      state.followers.push(item)
    })
  },
  [types.TWITTER_USERS_FRIENDSHIP_CREATE](state, payload) {
    state.friends.push(payload)
  },
  [types.TWITTER_USERS_FRIENDSHIP_DESTROY](state, payload) {
    let i = state.friends.map(item => item.id_str).indexOf(payload.id_str) 
    if (i !== -1) {
      state.friends.splice(i, 1)
    }
  }
}

const actions = {
  loadFriends({ commit }) {
    client.friendsList(account, payload => {
      if (payload.users) {
        commit(types.TWITTER_USERS_LOAD_FRIENDS, payload.users)
      }
    })
  },
  loadFollowers({ commit }) {
    client.followersList(account, payload => {
      if (payload.users) {
        commit(types.TWITTER_USERS_LOAD_FOLLOWERS, payload.users)
      }
    })
  },
  friendshipCreate({ commit }, id) {
    client.friendshipCreate({ name: account.screen_name, user_id: id }, response => {
      commit(types.TWITTER_SET_FRIENDS_COUNT, {type: 'increment'})
      commit(types.TWITTER_USERS_FRIENDSHIP_CREATE, response)
      commit(types.LOOKUP_USERS_FRIENDSHIP, { id: id, value: true })
    })
  },
  friendshipDestroy({ commit }, id) {
    client.friendshipDestroy({ name: account.screen_name, user_id: id }, response => {
      commit(types.TWITTER_SET_FRIENDS_COUNT, {type: 'decrement'})
      commit(types.TWITTER_USERS_FRIENDSHIP_DESTROY, response)
      commit(types.LOOKUP_USERS_FRIENDSHIP, { id: id, value: false })
    })
  }
}

export default {
  state, mutations, actions, getters
}
