import * as types from '../mutation-types'
import {client} from '@/store/connect'

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
    state.friends = [payload, ...state.friends]
  },
  [types.TWITTER_USERS_FRIENDSHIP_DESTROY](state, payload) {
    const id = payload.id_str
    let friendsIdx = state.friends.map(item => item.id_str).indexOf(id) 
    if (friendsIdx !== -1) {
      state.friends.splice(friendsIdx, 1)
    }
  },
  [types.TWITTER_USERS_BLOCKS_CREATE](state, payload) {
    const id = payload.id_str
    let friendsIdx = state.friends.map(item => item.id_str).indexOf(id) 
    if (friendsIdx !== -1) {
      state.friends.splice(friendsIdx, 1)
    }
  },
  [types.TWITTER_USERS_BLOCKS_DESTROY](state, payload) {},
  [types.TWITTER_USERS_MUTES_CREATE](state, payload) {
    console.log('mute-create', payload)
  },
  [types.TWITTER_USERS_MUTES_DESTROY](state, payload) {
    console.log('mute-destroy', payload)
  }
}

const actions = {
  loadFriends({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.friendsList(options).then(resp => {
        if (resp.users) {
          commit(types.TWITTER_USERS_LOAD_FRIENDS, resp.users)
          resolve(resp)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  loadFollowers({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.followersList(options).then(resp => {
        if (resp.users) {
          commit(types.TWITTER_USERS_LOAD_FOLLOWERS, resp.users)
          resolve(resp)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  friendshipCreate({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.friendshipCreate(options).then(response => {
        commit(types.TWITTER_SET_FRIENDS_COUNT, {type: 'increment'})
        commit(types.TWITTER_USERS_FRIENDSHIP_CREATE, response)
        commit(types.LOOKUP_USERS_FRIENDSHIP, { id: options.user_id, value: true })
        resolve(response)
      })
    })
  },
  friendshipDestroy({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.friendshipDestroy(options).then(response => {
        commit(types.TWITTER_SET_FRIENDS_COUNT, {type: 'decrement'})
        commit(types.TWITTER_USERS_FRIENDSHIP_DESTROY, response)
        commit(types.LOOKUP_USERS_FRIENDSHIP, { id: options.user_id, value: false })
        resolve(response)
      })
    })
  },
  blocksCreate({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.blocksCreate(options).then(response => {
        commit(types.TWITTER_SET_FRIENDS_COUNT, {type: 'decrement'})
        commit(types.TWITTER_USERS_FRIENDSHIP_DESTROY, response)
        commit(types.LOOKUP_USERS_FRIENDSHIP, { id: options.user_id, value: false })
        commit(types.TWITTER_USERS_BLOCKS_CREATE, response)
        resolve(response)
      })
    })
  },
  blocksDestroy({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.blocksDestroy(options).then(response => {
        commit(types.TWITTER_USERS_BLOCKS_DESTROY, response)
        resolve(response)
      })
    })
  },
  mutesCreate({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.mutesCreate(options).then(response => {
        commit(types.TWITTER_USERS_MUTES_CREATE, response)
        resolve(response)
      })
    })
  },
  mutesDestroy({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.mutesDestroy(options).then(response => {
        commit(types.TWITTER_USERS_MUTES_DESTROY, response)
        resolve(response)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
