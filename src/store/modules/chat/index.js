import { firestoreAction } from 'vuexfire'
import { MessageModel, ChannelModel } from './models'
import { messagesRef, channelsRef } from '@/services/firebase/index'

const firebaseActions = {
  firebaseMessageCreate: firestoreAction((context, message) => {
    return messagesRef.doc(message.id).set(message)
  }),
  firebaseChannelCreate: firestoreAction((context, channel) => {
    return channelsRef.doc(channel.id).set(channel)
  }),
  firebaseChannelBind: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef('channels', channelsRef, {
      serialize: snapshot => {
        // Wrap data into the model to set all required fields
        return new ChannelModel({
          ...snapshot.data(),
          id: snapshot.id
        })
      },
      reset: false
    })
  }),
  firebaseMessageBind: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef('messages', messagesRef, {
      serialize: snapshot => {
        // Wrap data into the model to set all required fields
        return new MessageModel({
          ...snapshot.data(),
          id: snapshot.id
        })
      },
      reset: false
    })
  })
}

export default {
  namespaced: true,
  state: {
    messages: [],
    channels: [],
    activeChannelId: null
  },
  getters: {
    channels: state => state.channels, // TODO: return only user's challens
    activeChannel: state =>
      state.channels.find(i => i.id === state.activeChannelId),
    activeChannelMessages: state =>
      state.messages.filter(i => i.channelId === state.activeChannelId)

    // userMessages: state => user => state.messages.filter(o => o.author === user)
  },
  actions: {
    ...firebaseActions,
    addMessage({ dispatch, state, rootState }, payload) {
      const message = new MessageModel({
        message: payload.message,
        authorId: rootState.users.authUserId,
        channelId: state.activeChannelId // TODO: check access to the channel
      })

      dispatch('firebaseMessageCreate', {
        ...message.toDict()
      })
    },
    createChannel({ dispatch, rootState }, payload) {
      return new Promise(resolve => {
        const channel = new ChannelModel({
          title: payload.title,
          authorId: rootState.users.authUserId,
          memberIds: [rootState.users.authUserId],
          isPrivate: payload.isPrivate
        })

        dispatch('firebaseChannelCreate', {
          ...channel.toDict()
        }).then(() => {
          resolve(channel)
        })
      })
    },
    setActiveChannel({ commit }, payload) {
      commit('setActiveChannel', payload.id)
    },
    setDefaultActiveChannel({ commit, getters, dispatch }) {
      // commit('setActiveChannel', payload.id)
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
    }
  },
  mutations: {
    setActiveChannel(state, id) {
      state.activeChannelId = id
    }
  }
}
