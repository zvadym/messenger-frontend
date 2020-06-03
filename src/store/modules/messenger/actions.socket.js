import bus from '@/bus'
import { dataToModel } from './actions.room'

export default {
  socket__addMessage({ dispatch }, payload) {
    dispatch('addMessage', { data: payload })
  },
  socket__updateRoom({ commit }, payload) {
    commit('updateRoom', dataToModel(payload))
  },
  socket__addRoom({ dispatch, getters }, payload) {
    if (!getters.getRoomById(payload.id)) {
      dispatch('addRoom', { data: payload }).then(room => {
        bus.$emit(
          'flash',
          `New room "${room.title}" is created by ${room.author.fullName}`,
          'info'
        )
      })
    }
  }
}
