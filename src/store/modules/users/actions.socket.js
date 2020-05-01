import { dataToModel } from './actions'
import bus from '@/bus'

export default {
  socket__updateUser({ commit }, payload) {
    commit('updateUser', dataToModel(payload))
  },
  socket__createUser({ dispatch }, payload) {
    bus.$emit(
      'flash',
      'A new member is joined - ' + dataToModel(payload).fullName,
      'info'
    )
    return dispatch('addUser', { data: payload })
  }
}
