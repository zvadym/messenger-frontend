export default {
  socket__addMessage({ dispatch }, payload) {
    dispatch('addMessage', { data: payload })
  },
  socket__updateRoom() {
    console.info('Action socket__updateRoom not found')
  }
}
