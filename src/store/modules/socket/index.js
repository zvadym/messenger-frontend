import Vue from 'vue'
import WS from '@/services/websocket/index'

export default {
  namespaced: false,
  state: {
    isConnected: false,
    message: '',
    reconnectError: false
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.isConnected = true
    },
    SOCKET_ONCLOSE(state) {
      state.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {
      state.message = message
      WS.receiveMessage(message)
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.reconnectError = true
    }
  },
  actions: {
    socketConnect({ rootGetters }) {
      WS.connect(rootGetters['auth/jwtAccess'])
    },
    socketDisconnect() {
      WS.disconnect()
    },
    socketSendMessage(context, message) {
      // ...
      Vue.prototype.$socket.sendObj({ msg: message })
      // ...
    }
  }
}
