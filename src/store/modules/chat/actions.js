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
        memberIds: [rootState.users.authUserId],
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
