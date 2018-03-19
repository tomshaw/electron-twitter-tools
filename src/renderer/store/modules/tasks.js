import * as types from '../mutation-types'
import {fpercent} from '@/config/helpers'

const state = {
  id: '',
  name: '',
  total: 0,
  done: -1,
  percent: 0
}

const getters = {
  getTaskProgress: state => state
}

const mutations = {
  [types.TASKS_SET_PROGRESS] (state, payload) {
    if (payload.hasOwnProperty('done')) {
      payload.percent = fpercent(payload.done, state.total)
    }
    state = Object.assign(state, payload)
  },
  [types.TASKS_RESET_PROGRESS] (state) {
    state = Object.assign(state, {
      id: '',
      name: '',
      total: 0,
      done: -1,
      percent: 0
    })
  }
}

const actions = {

}

export default {
  state, mutations, actions, getters
}
