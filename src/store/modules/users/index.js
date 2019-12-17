import { firestoreAction } from 'vuexfire'
import { UserModel } from './models'
import { usersRef } from '@/services/firebase/index'

export const SET_USER = 'SET_USER'

const firebaseActions = {
  firebaseCreate: firestoreAction((context, { user }) => {
    return usersRef.doc(user.id).set(user)
  }),
  firebaseBind: firestoreAction(({ bindFirestoreRef }) => {
    return bindFirestoreRef('users', usersRef, {
      serialize: snapshot => {
        // Wrap data into the model to set all required fields
        return new UserModel({
          ...snapshot.data()
        })
      },
      reset: false
    })
  }),
  updateActionAt: firestoreAction((context, { user }) => {
    return usersRef.doc(user.id).update({ lastActionAt: Date.now() })
  })
}

export default {
  namespaced: true,
  state: {
    authUserId: null,
    users: []
  },
  getters: {
    getById: state => id => state.users.find(item => item.id === id),
    getAuthUser: (state, getters) =>
      state.authUserId && getters.getById(state.authUserId)
  },
  actions: {
    ...firebaseActions,
    setAuthUser({ commit, getters, dispatch }, payload) {
      const userId = payload && payload.uid
      commit(SET_USER, userId)

      // A new users must be added to the firebase store.
      if (userId && !getters.getById(userId)) {
        const user = new UserModel({
          id: payload.uid,
          name: payload.displayName,
          email: payload.email,
          avatar: payload.photoURL
        })
        dispatch('firebaseCreate', { user: user.toDict() })
      }
    }
  },
  mutations: {
    [SET_USER](state, uid) {
      state.authUserId = uid
    }
  }
}
