import * as types from '../mutation-types'
import Database from '@/library/storage'
import Twitter from '@/library/twitter'
const settings = require('electron-settings')

function getDb () {
  let db
  if (db === undefined) {
    db = new Database(settings.get('storage.connection'))
  }
  return db
}

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(settings.get('twitter.tokens'))
  }
  return client
}

const db = getDb()
const client = getClient()
const account = settings.get('twitter.profile')

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
    let select = db.api.select('lists.id', 'lists.slug', 'lists.created_at', 'lists_store.screen_name')
      .from('lists')
      .count('lists_store.list_id AS member_count')
      .leftJoin('lists_store', 'lists.id', 'lists_store.list_id')
      .groupBy('lists.id')
      .orderBy('lists.created_at', 'DESC')
    select.then(rows => {
      commit(types.TWITTER_LISTS_SAVED, rows)
    })
  },
  loadActiveLists({ commit }) {
    client.userLists(account, response => {
      if (response.length) {
        commit(types.TWITTER_LISTS_ACTIVE, response)
      }
    })
  },
  deleteListLocal({ commit }, id) {
    db.api('lists').where('id', id).del().then((resp) => {
      db.api('lists_store').where('list_id', id).del().then((resp) => {
        commit(types.TWITTER_LISTS_DELETE_LOCAL, id)
      })
    })
  },
  deleteListRemote({ commit }, options) {
    client.postListDestroy(options, response => {
      commit(types.TWITTER_LISTS_DELETE_REMOTE, options.list_id)
    })
  },
  updateListLocal({ commit }, data) {
    db.api('lists').update('slug', data.slug).where('id', '=', data.id).then((resp) => {
      commit(types.TWITTER_LISTS_UPDATE_LOCAL, data)
    })
  },
  updateListRemote({ commit }, options) {
    client.postListUpdate(options, response => {
      commit(types.TWITTER_LISTS_UPDATE_REMOTE, options)
    })
  }
}

export default {
  state, mutations, actions, getters
}
