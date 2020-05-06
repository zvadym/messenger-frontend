import bus from '@/bus'

export default {
  socket__addMessage({ dispatch }, payload) {
    dispatch('addMessage', { data: payload })
  },
  socket__updateRoom() {
    console.info('Action socket__updateRoom not found')
  },
  socket__addRoom({ dispatch, getters }, payload) {
    if (!getters.getRoomById(payload.id)) {
      dispatch('addRoom', { data: payload }).then(room => {
        console.log('socket__addRoom', room, room.author)
        bus.$emit(
          'flash',
          `New room "${room.title}" is created by ${room.author.fullName}`,
          'info'
        )
      })
    }
  }
}
