import { MessageModel } from './models'
import api from '@/services/api/index'

export default {
  loadMessages({ commit }, payload) {
    return api.getMessages(payload.room.id).then(data => {
      data.forEach(item => {
        const message = new MessageModel({
          id: item.id,
          message: item.message,
          authorId: item.created_by,
          roomId: item.room_id,
          createdAt: item.created_dt
        })
        commit('addMessage', message)
      })
    })
  },
  createMessage({ state, rootState }, payload) {
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
  }
}
