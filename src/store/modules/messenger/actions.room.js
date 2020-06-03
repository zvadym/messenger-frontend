import { RoomModel } from './models'
import api from '@/services/api/index'

export const dataToModel = data =>
  new RoomModel({
    id: data.id,
    title: data.title,
    authorId: data.created_by,
    memberIds: data.members,
    isPrivate: data.is_private,
    createdAt: Date.parse(data.created_dt),
    updatedAt: Date.parse(data.updated_dt)
  })

export default {
  loadRooms({ dispatch }) {
    return api.getRooms().then(data => {
      let promises = []
      data.forEach(item => promises.push(dispatch('addRoom', { data: item })))
      return Promise.all(promises)
    })
  },
  // Add existing instance to vuex
  addRoom({ commit, dispatch }, { data }) {
    const room = dataToModel(data)
    commit('addRoom', room)

    // Connect to room' channel (websocket)
    return dispatch('socketConnectToRoom', room.id, { root: true }).then(
      () => room
    )
  },
  setActiveRoom({ commit }, { id }) {
    commit('setActiveRoom', id)
  },
  createRoom(context, payload) {
    return api
      .createRoom({
        title: payload.title,
        memberIds: payload.memberIds,
        isPrivate: payload.isPrivate
      })
      .then(data => dataToModel(data))
  },
  saveRoomChanges({ getters }, payload) {
    const room = getters.getRoomById(payload.id)

    return api
      .updateRoom({
        ...room,
        ...payload
      })

      .then(data => dataToModel(data))
  }
}
