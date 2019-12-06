import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

import '@/services/firebase/index'
import '@/registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
