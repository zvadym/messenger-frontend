import _ from 'lodash'
import { MessageModel, ChannelModel } from './models'
import firebaseActions from './firebaseActions'
import { getChannelMessagesStateLabel } from './utils'

export default {
  ...firebaseActions,

  addMessage({ dispatch, state, rootState }, payload) {
    const message = new MessageModel({
      message: payload.message,
      authorId: rootState.users.authUserId
    })

    dispatch('firebaseMessageCreate', {
      channelId: state.activeChannelId,
      message: message.toDict()
    })
  },
  addNotice({ dispatch }, { message, channel }) {
    const notice = new MessageModel({
      message,
      isNotice: true
    })

    dispatch('firebaseMessageCreate', {
      channelId: channel.id,
      message: notice.toDict()
    })
  },
  createChannel({ dispatch, rootState, rootGetters }, payload) {
    return new Promise(resolve => {
      const user = rootGetters['users/getAuthUser']
      const channel = new ChannelModel({
        title: payload.title,
        authorId: user.id,
        memberIds: [
          rootState.users.authUserId,
          ...(payload.invitedUsers || [])
        ],
        isPrivate: payload.isPrivate
      })

      dispatch('firebaseChannelCreate', {
        ...channel.toDict()
      })
        .then(() => {
          // Add "created" notice
          dispatch('addNotice', {
            message: `Channel was created by ${user.name}`,
            channel
          })
        })
        .then(() => {
          resolve(channel)
        })
    })
  },
  updateChannel({ dispatch, rootGetters, getters }, payload) {
    const channel = { ...getters.getById(payload.id) }
    const user = rootGetters['users/getAuthUser']

    let changes = []

    return new Promise(resolve => {
      if (channel.title !== payload.title) {
        changes.push(
          `Title was changed from "${channel.title}" to "${payload.title}" by ${user.name}`
        )
        channel.title = payload.title
      }

      if (channel.isPrivate !== payload.isPrivate) {
        let notice = payload.isPrivate
          ? 'Channel is private from now'
          : 'Channel is public from now'
        notice += ` (changed by ${user.name})`
        changes.push(notice)
        channel.isPrivate = payload.isPrivate
      }

      if (payload.isPrivate) {
        if (!_.has(payload.invitedUsers, channel.authorId)) {
          payload.invitedUsers.push(channel.authorId)
        }

        // deletedUsers
        _.difference(channel.memberIds, payload.invitedUsers).forEach(uId => {
          const _user = rootGetters['users/getById'](uId)
          changes.push(
            `"${_user.name}" was removed from this channel (by ${user.name})`
          )
        })

        // newUsers
        _.difference(payload.invitedUsers, channel.memberIds).forEach(uId => {
          const _user = rootGetters['users/getById'](uId)
          changes.push(
            `"${_user.name}" was added to this channel (by ${user.name})`
          )
        })
      } else {
        payload.invitedUsers = []
      }

      channel.memberIds = payload.invitedUsers

      dispatch('firebaseChannelUpdate', {
        ...channel
      })
        .then(() => {
          changes.forEach(message => {
            dispatch('addNotice', {
              message,
              channel
            })
          })
        })
        .then(() => {
          resolve(channel)
        })
    })
  },
  setActiveChannel({ commit }, payload) {
    commit('setActiveChannel', payload.id)
  },
  setDefaultActiveChannel({ commit, getters, dispatch }) {
    const channels = getters.channels

    if (!channels.length) {
      // Create a new channel and set it as "Active"
      dispatch('createChannel', { title: 'master', isPrivate: false }).then(
        channel => {
          commit('setActiveChannel', channel.id)
        }
      )
    } else {
      commit('setActiveChannel', channels[0].id)
    }
  },
  createMessagesRoot({ commit }, { channel }) {
    commit('createMessagesRoot', getChannelMessagesStateLabel(channel))
  }
}
