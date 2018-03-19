/*!
 * Electron Twitter Tools
 * Copyright (c) 2018 Tom Shaw. https://github.com/tomshaw
 * MIT Licensed
 */

import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import DateFormat from 'dateformat'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueToastr from '@deveodk/vue-toastr'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'

import App from './App'
import router from './router'
import store from './store'

import settings from '@/mixins/settings'

Vue.mixin(settings)

Vue.use(Vuetify)

// https://github.com/Deveodk/vue-toastr
Vue.use(VueToastr, {
  defaultPosition: 'toast-top-right',
  defaultType: 'info',
  defaultTimeout: 5e3
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('MMMM Do YYYY')
  }
})

Vue.filter('twitterTime', (value) => {
  if (value) {
    let date = new Date(value.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, '$1 $2 $4 $3 UTC'))
    return DateFormat(date, 'yyyy/mm/dd HH:MM:ss')
  }
})

Vue.filter('timeAgo', (value) => {
  if (value) {
    return moment(new Date(value)).locale('en-short').fromNow()
  }
})
