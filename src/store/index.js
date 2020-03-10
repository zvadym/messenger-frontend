import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth/index'
import messenger from './modules/messenger/index'
import users from './modules/users/index'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth,
    messenger,
    users
  },
  state: {},
  mutations: {},
  actions: {}
})
