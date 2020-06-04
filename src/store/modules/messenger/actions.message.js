import { MessageModel } from './models'
import api from '@/services/api/index'

export const messageDataToModel = data =>
  new MessageModel({
    id: data.id,
    message: data.message,
    authorId: data.created_by,
    roomId: data.room_id,
    createdAt: data.created_dt,
    isNotification: false
  })

export const notificationDataToModel = data =>
  new MessageModel({
    id: data.id,
    message: data.message,
    roomId: data.room_id,
    createdAt: data.created_dt,
    isNotification: true
  })

export default {
  loadMessages({ dispatch }, payload) {
    // Get all room's messages via API
    const prom1 = api
      .getMessages(payload.room.id)
      .then(data =>
        data.forEach(item => dispatch('addMessage', { data: item }))
      )

    const prom2 = api
      .getNotifications(payload.room.id)
      .then(data =>
        data.forEach(item =>
          dispatch('addMessage', { data: item, isNotification: true })
        )
      )

    return Promise.all([prom1, prom2])
  },
  createMessage({ state, rootState }, payload) {
    // Sent a new message's data to backend via API
    // After that `addMessage` will be called by WS
    return new Promise(resolve => {
      const message = new MessageModel({
        message: payload.message,
        authorId: rootState.auth.authUserId,
        roomId: state.activeRoomId
      })

      api.createMessage(message).then(() => {
        resolve(message)
      })
    })
  },
  addMessage({ commit, getters }, { data, isNotification = false }) {
    let message
    // Add message to store
    if (!isNotification) {
      message = messageDataToModel(data)
    } else {
      message = notificationDataToModel(data)
    }

    // check if message with id exists and replace
    if (getters.getMessageById(message.id)) {
      commit('updateMessage', message)
    } else {
      commit('addMessage', message)
    }
  }
}
