import * as types from '../mutation-types'
import {db, client, account} from '@/store/connect'

const state = {
  saved: [],
  active: []
}

const getters = {
  getSavedLists: state => state.saved,
  getActiveLists: state => state.active
}

const mutations = {
  [types.TWITTER_LISTS_SAVED](state, lists) {
    state.saved = []
    lists.forEach((list) => {
      state.saved.push(list)
    })
  },
  [types.TWITTER_LISTS_ACTIVE](state, lists) {
    state.active = []
    lists.forEach((list) => {
      state.active.push(list)
    })
  },
  [types.TWITTER_LISTS_DELETE_LOCAL](state, id) {
    let i = state.saved.map(item => item.id).indexOf(id) 
    state.saved.splice(i, 1)
  },
  [types.TWITTER_LISTS_DELETE_REMOTE](state, id) {
    let i = state.active.map(item => item.id_str).indexOf(id) 
    state.active.splice(i, 1)
  },
  [types.TWITTER_LISTS_UPDATE_LOCAL](state, data) {
    let savedIdx = state.saved.map(item => item.id).indexOf(data.id) 
    if (savedIdx !== -1) {
      state.saved[savedIdx].slug = data.slug
    }
  },
  [types.TWITTER_LISTS_UPDATE_REMOTE](state, data) {
    let activeIdx = state.active.map(item => item.id_str).indexOf(data.list_id) 
    if (activeIdx !== -1) {
      state.active[activeIdx].name = data.name
      state.active[activeIdx].slug = data.name
    }
  }
}

const actions = {
  loadSavedLists({ commit }) {
    return new Promise((resolve, reject) => {
      let select = db.api.select('lists.id', 'lists.slug', 'lists.created_at', 'lists_store.screen_name')
        .from('lists')
        .count('lists_store.list_id AS member_count')
        .leftJoin('lists_store', 'lists.id', 'lists_store.list_id')
        .groupBy('lists.id')
        .orderBy('lists.created_at', 'DESC')
      select.then(rows => {
        commit(types.TWITTER_LISTS_SAVED, rows)
        resolve()
      })
    })
  },
  loadActiveLists({ commit }) {
    return new Promise((resolve, reject) => {
      client.userLists(account).then(resp => {
        commit(types.TWITTER_LISTS_ACTIVE, resp)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteListLocal({ commit }, id) {
    return new Promise((resolve, reject) => {
      db.api('lists').where('id', id).del().then((resp) => {
        db.api('lists_store').where('list_id', id).del().then((resp) => {})
        commit(types.TWITTER_LISTS_DELETE_LOCAL, id)
        resolve(id)
      })
    })
  },
  deleteListRemote({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postListDestroy(options).then(response => {
        commit(types.TWITTER_LISTS_DELETE_REMOTE, options.list_id)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateListLocal({ commit }, data) {
    return new Promise((resolve, reject) => {
      db.api('lists').update('slug', data.slug).where('id', '=', data.id).then((resp) => {
        commit(types.TWITTER_LISTS_UPDATE_LOCAL, data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateListRemote({ commit }, options) {
    return new Promise((resolve, reject) => {
      client.postListUpdate(options).then(resp => {
        commit(types.TWITTER_LISTS_UPDATE_REMOTE, options)
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
