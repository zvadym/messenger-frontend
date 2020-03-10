import Vue from 'vue'

export default {
  addRoom(state, data) {
    state.channels.push(data)
  },
  setActiveChannel(state, id) {
    state.activeChannelId = id
  },
  createMessagesRoot(state, name) {
    Vue.set(state, name, [])
  }
}
