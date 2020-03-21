import { RoomModel } from './models'
import api from '@/services/api/index'

export default {
  // Add existing instance to vuex
  addRoom({ commit, dispatch }, payload) {
    // Add member to vuex
    dispatch('users/addUser', payload.created_by, { root: true })
    payload.members.forEach(item =>
      dispatch('users/addUser', item, { root: true })
    )

    commit(
      'addRoom',
      new RoomModel({
        id: payload.id,
        title: payload.title,
        authorId: payload.created_by.id,
        memberIds: payload.members.map(item => item.id),
        isPrivate: payload.is_private,
        createdAt: Date.parse(payload.created_dt),
        lastMessageAt: Date.parse(
          (payload.lastMessageAt && payload.lastMessageAt.created_dt) ||
            payload.created_dt
        )
      })
    )
  },
  setActiveRoom({ commit }, payload) {
    commit('setActiveRoom', payload.id)
  },
  createRoom({ dispatch, rootState, rootGetters }, payload) {
    return new Promise(resolve => {
      const user = rootGetters['users/getAuthUser']
      const room = new RoomModel({
        title: payload.title,
        authorId: user.id,
        memberIds: [
          rootState.users.authUserId,
          ...(payload.invitedUsers || [])
        ],
        isPrivate: payload.isPrivate
      })

      api
        .createRoom(room)
        .then(() => {
          // Add "created" notice
          dispatch('addNotice', {
            message: `Room was created by ${user.name}`,
            room
          })
        })
        .then(() => {
          resolve(room)
        })
    })
  }
}
