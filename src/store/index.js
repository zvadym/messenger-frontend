import Vue from 'vue'
import Vuex from 'vuex'
import { createStore } from 'vuex-extensions'

import auth from './modules/auth/index'
import messenger from './modules/messenger/index'
import socket from './modules/socket/index'
import users from './modules/users/index'

Vue.use(Vuex)

export default createStore(Vuex.Store, {
  strict: true,
  modules: {
    auth,
    messenger,
    socket,
    users
  },
  state: {},
  mutations: {},
  actions: {}
})
