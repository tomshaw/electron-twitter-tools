import * as types from '../mutation-types'
import Twitter from '@/library/twitter'
const settings = require('electron-settings')

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(settings.get('twitter.tokens'))
  }
  return client
}

const client = getClient()

const state = {
  message: '',
  images: [],
  reply: {}
}

const getters = {
  getMessage: state => state.message,
  getImages: state => state.images,
  getReply: state => state.reply
}

const mutations = {
  [types.TWEET_FORM_RESET](state) {
    state.message = ''
    state.images = []
    state.reply = {}
  },
  [types.TWEET_FORM_SET_MESSAGE](state, message) {
    state.message = message
  },
  [types.TWEET_FORM_ADD_IMAGE](state, image) {
    state.images.push(image)
  },
  [types.TWEET_FORM_REMOVE_IMAGE](state, image) {
    state.images.splice(state.images.indexOf(image), 1)
  },
  [types.TWEET_FORM_SET_REPLY](state, payload) {
    state.reply = payload
  }
}

const actions = {
  postMessage({ commit }, payload) {
    return new Promise((resolve, reject) => {
      client.postTweet(payload).then(response => {
        commit(types.TWEET_FORM_RESET)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  state, mutations, actions, getters
}
