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
      let i = state.connections.findIndex(item => item.client === payload.client)
      if (i !== -1) {
        //state.connections[i] = payload
        Object.assign(state.connections[i], payload);
      }
    }
  },
  [types.STORAGE_ADD_CONNECTIONS] (state, payload) {
    state.connections = payload
  }
}

const actions = {
  setAdapter: ({commit}, payload) => {
    commit(types.STORAGE_SET_ADAPTER, payload)
  },
  addConnection: ({commit}, payload) => {
    commit(types.STORAGE_ADD_CONNECTION, payload)
  },
  addConnections: ({commit}, payload) => {
    commit(types.STORAGE_ADD_CONNECTIONS, payload)
  }
}

export default {
  state, mutations, actions, getters
}
