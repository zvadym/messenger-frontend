import Vue from 'vue'

export default {
  setActiveChannel(state, id) {
    state.activeChannelId = id
  },
  createMessagesRoot(state, name) {
    Vue.set(state, name, [])
  }
}
