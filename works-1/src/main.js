import 'onsenui/css/onsenui.css' // Onsen UI basic CSS
import 'onsenui/css/onsen-css-components.css' // Default Onsen UI CSS components

import Vue from 'vue'
import VueOnsen from 'vue-onsenui'

import AppNavigator from '@/AppNavigator'
import store from '@/store'

Vue.use(VueOnsen)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(AppNavigator),
  store,
})
