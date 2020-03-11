import _ from 'lodash'
import { MessageModel, RoomModel } from './models'
import { getRoomMessagesStateLabel } from './utils'
import { createRoom } from '@/services/api/index'

export default {
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
        createdAt: Date.parse(payload.created_dt),
        lastMessageAt: Date.parse(
          (payload.lastMessageAt && payload.lastMessageAt.created_dt) ||
            payload.created_dt
        )
      })
    )
  },

  // TODO: old code
  addMessage({ dispatch, state, rootState }, payload) {
    const message = new MessageModel({
      message: payload.message,
      authorId: rootState.users.authUserId
    })

    dispatch('firebaseMessageCreate', {
      roomId: state.activeRoomId,
      message: message.toDict()
    })
  },
  addNotice({ dispatch }, { message, room }) {
    const notice = new MessageModel({
      message,
      isNotice: true
    })

    dispatch('firebaseMessageCreate', {
      roomId: room.id,
      message: notice.toDict()
    })
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

      createRoom({
        ...room.toDict()
      })
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
  },
  updateRoom({ dispatch, rootGetters, getters }, payload) {
    const room = { ...getters.getById(payload.id) }
    const user = rootGetters['users/getAuthUser']

    let changes = []

    return new Promise(resolve => {
      if (room.title !== payload.title) {
        changes.push(
          `Title was changed from "${room.title}" to "${payload.title}" by ${user.name}`
        )
        room.title = payload.title
      }

      if (room.isPrivate !== payload.isPrivate) {
        let notice = payload.isPrivate
          ? 'Room is private from now'
          : 'Room is public from now'
        notice += ` (changed by ${user.name})`
        changes.push(notice)
        room.isPrivate = payload.isPrivate
      }

      if (payload.isPrivate) {
        if (!_.has(payload.invitedUsers, room.authorId)) {
          payload.invitedUsers.push(room.authorId)
        }

        // deletedUsers
        _.difference(room.memberIds, payload.invitedUsers).forEach(uId => {
          const _user = rootGetters['users/getById'](uId)
          changes.push(
            `"${_user.name}" was removed from this room (by ${user.name})`
          )
        })

        // newUsers
        _.difference(payload.invitedUsers, room.memberIds).forEach(uId => {
          const _user = rootGetters['users/getById'](uId)
          changes.push(
            `"${_user.name}" was added to this room (by ${user.name})`
          )
        })
      } else {
        payload.invitedUsers = []
      }

      room.memberIds = payload.invitedUsers

      dispatch('firebaseC-hannelUpdate', {
        ...room
      })
        .then(() => {
          changes.forEach(message => {
            dispatch('addNotice', {
              message,
              room
            })
          })
        })
        .then(() => {
          resolve(room)
        })
    })
  },
  setActiveRoom({ commit }, payload) {
    commit('setActiveRoom', payload.id)
  },
  setDefaultActiveRoom({ commit, getters, dispatch }) {
    const rooms = getters.rooms

    if (!rooms.length) {
      // Create a new room and set it as "Active"
      dispatch('createRoom', { title: 'master', isPrivate: false }).then(
        room => {
          commit('setActiveRoom', room.id)
        }
      )
    } else {
      commit('setActiveRoom', rooms[0].id)
    }
  },
  createMessagesRoot({ commit }, { room }) {
    commit('createMessagesRoot', getRoomMessagesStateLabel(room))
  }
}
