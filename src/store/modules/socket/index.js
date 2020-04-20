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
      if (!state.isConnected) {
        Vue.prototype.$socket = event.currentTarget
        state.isConnected = true
      }
    },
    SOCKET_ONCLOSE(state) {
      Vue.prototype.$socket = null
      state.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    SOCKET_ONMESSAGE(state, message) {
      // default handler called only if `message.action` isn't found
      // otherwise store's action will be dispatched automaticaly
      state.message = message
    },
    SOCKET_RECONNECT(state, count) {
      // mutations for reconnect methods
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
    socketConnectToRoom(context, roomId) {
      Vue.prototype.$socket.sendObj({
        type: 'room-join',
        id: roomId
      })
    }
  }
}
