/*!
 * Electron Twitter Tools
 * Copyright (c) 2018 Tom Shaw. https://github.com/tomshaw
 * MIT Licensed
 */

import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueToastr from '@deveodk/vue-toastr'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'

import AmCharts from 'amcharts3' // eslint-disable-line no-unused-vars
import AmSerial from 'amcharts3/amcharts/serial' // eslint-disable-line no-unused-vars

import Chartist from 'chartist' // eslint-disable-line no-unused-vars
import 'chartist/dist/chartist.min.css'

import App from './App'
import router from './router'
import store from './store'

import account from '@/mixins/account'
import reload from '@/mixins/reload'
import locations from '@/mixins/locations'
import settings from '@/mixins/settings'

Vue.mixin(account)
Vue.mixin(locations)
Vue.mixin(reload)
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

Vue.filter('formatDate', (value, format = 'MMMM Do YYYY') => {
  if (value) {
    return moment(String(value)).format(format)
  }
})

Vue.filter('timeAgo', (value) => {
  if (value) {
    return moment(new Date(value)).fromNow()
  }
})
