import { firestoreAction } from 'vuexfire'

import { UserModel } from '@/store/modules/users/models'
import { MessageModel } from './models'

import { messagesRef } from '@/services/firebase/index'

const firebaseActions = {
  firebaseCreate: firestoreAction((context, message) => {
    return messagesRef.doc(message.id).set(message)
  }),
  firebaseBind: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef('messages', messagesRef, {
      serialize: snapshot => {
        // Wrap data into the model to set all required fields
        const data = snapshot.data()
        return new MessageModel({
          ...data,
          id: snapshot.id,
          author: new UserModel({ ...snapshot.authorId })
        })
      },
      reset: false
    })
  })
}

export default {
  namespaced: true,
  state: {
    messages: []
  },
  getters: {
    messages: state => state.messages
    // userMessages: state => user => state.messages.filter(o => o.author === user)
  },
  actions: {
    ...firebaseActions,
    addMessage({ dispatch, rootGetters }, payload) {
      const message = new MessageModel({
        message: payload.message
      })

      dispatch('firebaseCreate', {
        ...message.toDict(),
        authorId: rootGetters['users/authUser'].id
      })
    }
  },
  mutations: {}
}
