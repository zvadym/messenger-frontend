import Vue from 'vue'

const vm = new Vue()

export default {
  connect(token) {
    vm.$connect(process.env.VUE_APP_WEBSOCKET_BASE_URL + '?token=' + token)
  },
  disconnect() {
    vm.$disconnect()
  }
}
