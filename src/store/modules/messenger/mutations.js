import Vue from 'vue'

export default {
  addRoom(state, data) {
    state.rooms.push(data)
  },
  setActiveRoom(state, id) {
    state.activeRoomId = id
  },
  createMessagesRoot(state, name) {
    Vue.set(state, name, [])
  }
}
