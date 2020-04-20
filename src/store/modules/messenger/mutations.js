export default {
  //
  // **** Rooms
  //
  addRoom(state, data) {
    state.rooms.push(data)
  },
  updateRoom(state, data) {
    state.rooms = [
      ...state.rooms.filter(element => element.id !== data.id),
      data
    ]
  },
  setActiveRoom(state, id) {
    state.activeRoomId = id
  },
  //
  // **** Messages
  //
  addMessage(state, data) {
    state.messages.push(data)
  },
  updateMessage(state, data) {
    state.messages = [
      ...state.messages.filter(element => element.id !== data.id),
      data
    ]
  }
}
