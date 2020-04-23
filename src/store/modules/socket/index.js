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
      // default handler called for all methods
      // Notice: All events handled by `passToStoreHandler`
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
    socketOnEvent({ dispatch }, event) {
      // It works like if it set `VueNativeSock.format=json`
      // but in this way it's possible to control things
      // and, as it is done below, add prefix to action name
      if (event.isTrusted && event.data) {
        const data = JSON.parse(event.data)
        if (data.action) {
          let action = 'socket__' + data.action

          if (data.namespace) {
            action = data.namespace + '/' + action
          }

          dispatch(action, data.data, {
            root: true
          })
        }
      }
    },

    socketConnectToRoom(context, roomId) {
      WS.connectToRoom(roomId)
    }
  }
}
