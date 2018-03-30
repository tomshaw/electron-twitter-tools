import * as types from '../mutation-types'

const state = {
  adapter: 'sqlite3',
  connections: [{
    client: 'sqlite3'
  }]
}

const getters = {
  getAdapter: state => state.adapter,
  getConnections: state => state.connections,
  getConnection(state) {
    return state.connections.find(item => item.client === state.adapter)
  }
}

const mutations = {
  [types.STORAGE_SET_ADAPTER] (state, payload) {
    state.adapter = payload
  },
  [types.STORAGE_ADD_CONNECTION] (state, payload) {
    const found = state.connections.find(item => item.client === payload.client)
    if (!found) {
      state.connections.push(payload)
    } else {
      const connection = state.connections.findIndex(item => item.client === payload.client)
      if (connection !== -1) {
        Object.assign(state.connections[connection], payload);
      }
    }
  },
  [types.STORAGE_ADD_CONNECTIONS] (state, payload) {
    state.connections = payload
  }
}

export default {
  state, mutations, getters
}
