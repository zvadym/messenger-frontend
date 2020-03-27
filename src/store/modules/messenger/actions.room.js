import _ from 'lodash'
import { RoomModel } from './models'
import api from '@/services/api/index'

export default {
  loadRooms({ dispatch }) {
    return api.getRooms().then(data => {
      data.forEach(item => {
        dispatch('addRoom', item)
      })
    })
  },
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
        memberIds: payload.members,
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
        memberIds: [rootState.users.authUserId, ...(payload.members || [])],
        isPrivate: payload.isPrivate
      })

      api
        .createRoom(room)
        .then(() => {
          // Add "created" notice
          dispatch('addNotice', {
            message: `Room was created by ${user.fullName}`,
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
          `Title was changed from "${room.title}" to "${payload.title}" by ${user.fullName}`
        )
        room.title = payload.title
      }

      if (room.isPrivate !== payload.isPrivate) {
        let notice = payload.isPrivate
          ? 'Room is private from now'
          : 'Room is public from now'
        notice += ` (changed by ${user.fullName})`
        changes.push(notice)
        room.isPrivate = payload.isPrivate
      }

      if (payload.isPrivate) {
        if (!_.has(payload.members, room.authorId)) {
          payload.members.push(room.authorId)
        }

        // deletedUsers
        _.difference(room.memberIds, payload.members)
          .filter(item => !!item)
          .forEach(uId => {
            const _user = rootGetters['users/getById'](uId)
            changes.push(
              `"${_user.fullName}" was removed from this room (by ${user.fullName})`
            )
          })

        // newUsers
        _.difference(payload.members, room.memberIds)
          .filter(item => !!item)
          .forEach(uId => {
            const _user = rootGetters['users/getById'](uId)

            changes.push(
              `"${_user.fullName}" was added to this room (by ${user.fullName})`
            )
          })
      } else {
        payload.members = []
      }

      room.members = payload.members

      api
        .updateRoom({
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
  }
}
