import _ from 'lodash'
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
  createRoom({ dispatch, rootState, rootGetters }, payload) {
    return new Promise(resolve => {
      const userId = rootState.auth.authUserId
      const room = new RoomModel({
        title: payload.title,
        authorId: userId,
        memberIds: [userId, ...(payload.members || [])],
        isPrivate: payload.isPrivate
      })

      api.createRoom(room).then(data => {
        // The room will be added via "socket__addRoom"
        //      dispatch('addRoom', { data: roomData })

        const roomInstance = dataToModel(data)
        const user = rootGetters['users/getById'](roomInstance.authorId)

        // Add "created" notice
        return dispatch('addNotice', {
          message: `Room was created by ${user.fullName}`,
          roomInstance
        }).then(resolve(roomInstance))
      })
    })
  },
  updateRoom({ dispatch, rootGetters, getters }, { data }) {
    const room = { ...getters.getRoomById(data.id) }
    const user = rootGetters['users/getAuthUser']

    let changes = []

    return new Promise(resolve => {
      if (room.title !== data.title) {
        changes.push(
          `Title was changed from "${room.title}" to "${data.title}" by ${user.fullName}`
        )
        room.title = data.title
      }

      if (room.isPrivate !== data.isPrivate) {
        let notice = data.isPrivate
          ? 'Room is private from now'
          : 'Room is public from now'
        notice += ` (changed by ${user.fullName})`
        changes.push(notice)
        room.isPrivate = data.isPrivate
      }

      if (data.isPrivate) {
        if (!_.has(data.members, room.authorId)) {
          data.members.push(room.authorId)
        }

        // deletedUsers
        _.difference(room.memberIds, data.members)
          .filter(item => !!item)
          .forEach(uId => {
            const _user = rootGetters['users/getById'](uId)
            changes.push(
              `"${_user.fullName}" was removed from this room (by ${user.fullName})`
            )
          })

        // newUsers
        _.difference(data.members, room.memberIds)
          .filter(item => !!item)
          .forEach(uId => {
            const _user = rootGetters['users/getById'](uId)

            changes.push(
              `"${_user.fullName}" was added to this room (by ${user.fullName})`
            )
          })
      } else {
        data.members = []
      }

      room.members = data.members

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
