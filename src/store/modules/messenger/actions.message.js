import { MessageModel } from './models'
import api from '@/services/api/index'

export default {
  loadMessages({ dispatch }, payload) {
    // Get all room's messages via API
    return api.getMessages(payload.room.id).then(data => {
      data.forEach(item => {
        dispatch('addMessage', { message: item })
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
  addMessage({ commit, getters }, { message }) {
    // Add message to store
    const m = new MessageModel({
      id: message.id,
      message: message.message,
      authorId: message.created_by,
      roomId: message.room_id,
      createdAt: message.created_dt
    })

    // check if message with id exists and replace
    if (getters.getMessageById(m.id)) {
      commit('updateMessage', m)
    } else {
      commit('addMessage', m)
    }
  }
}
