import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import chat from './modules/chat/index'
import users from './modules/users/index'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    chat,
    users
  },
  state: {},
  mutations: {
    ...vuexfireMutations
  },
  actions: {}
})
