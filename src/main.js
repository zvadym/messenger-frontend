import Vue from 'vue'
import IdleVue from 'idle-vue'
import VueNativeSock from 'vue-native-websocket'

import vuetify from '@/plugins/vuetify'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

import '@/registerServiceWorker'

Vue.config.productionTip = false

const eventsHub = new Vue()

Vue.use(IdleVue, { eventEmitter: eventsHub })
Vue.use(VueNativeSock, process.env.VUE_APP_WEBSOCKET_BASE_URL, {
  connectManually: true,
  store,
  passToStoreHandler: function(eventName, event, next) {
    if (eventName.toUpperCase() === 'SOCKET_ONMESSAGE') {
      store.dispatch('socketOnEvent', event)
    }
    next(eventName, event)
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
