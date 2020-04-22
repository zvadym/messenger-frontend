import { MessageModel } from './models'
import api from '@/services/api/index'

export default {
  loadMessages({ dispatch }, payload) {
    // Get all room's messages via API
    return api.getMessages(payload.room.id).then(data => {
      data.forEach(item => {
        dispatch('addMessage', { data: item })
      })
    })
  },
  createMessage({ state, rootState }, payload) {
    // Sent a new message's data to backend via API
    // After that `addMessage` will be called by WS
    return new Promise(resolve => {
      const message = new MessageModel({
        message: payload.message,
        authorId: rootState.users.authUserId,
        roomId: state.activeRoomId
      })

      api.createMessage(message).then(() => {
        resolve(message)
      })
    })
  },
  addMessage({ commit, getters, dispatch }, { data }) {
    // Add message to store
    const m = new MessageModel({
      id: data.id,
      message: data.message,
      authorId: data.created_by,
      roomId: data.room_id,
      createdAt: data.created_dt
    })

    return dispatch('users/addUser', m.authorId, { root: true }).then(() => {
      // check if message with id exists and replace
      if (getters.getMessageById(m.id)) {
        commit('updateMessage', m)
      } else {
        commit('addMessage', m)
      }
    })
  }
}
