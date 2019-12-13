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
        const data = snapshot.data()
        return {
          ...new UserModel({
            ...data
          })
        }
      },
      reset: false
    })
  })
}

export default {
  namespaced: true,
  state: {
    authUser: null,
    users: []
  },
  getters: {
    authUser: state => state.authUser,
    users: state => state.users,
    getById: state => id => state.users.find(item => item.id === id)
  },
  actions: {
    ...firebaseActions,
    setAuthUser({ commit, getters, dispatch }, payload) {
      const user = payload
        ? new UserModel({
            id: payload.uid,
            name: payload.displayName,
            email: payload.email,
            avatar: payload.photoURL
          })
        : null
      commit(SET_USER, user.toDict())

      // A new users must be added to the firebase store.
      // TODO:
      if (!getters.getById(user.id)) {
        dispatch('firebaseCreate', { user: { ...user } })
      }
    }
  },
  mutations: {
    [SET_USER](state, user) {
      state.authUser = user
    }
  }
}
