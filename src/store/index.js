import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth/index'
import chat from './modules/chat/index'
import users from './modules/users/index'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    auth,
    chat,
    users
  },
  state: {},
  mutations: {},
  actions: {}
})
