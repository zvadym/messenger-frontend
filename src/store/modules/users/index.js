import { UserModel } from './models'

export const SET_USER = 'SET_USER'

export default {
  namespaced: true,
  state: {
    authUserId: null,
    users: []
  },
  getters: {
    getById: state => id => state.users.find(item => item.id === id),
    getByName: state => name => state.users.find(item => item.name === name),
    getAuthUser: (state, getters) =>
      state.authUserId && getters.getById(state.authUserId)
  },
  actions: {
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
    },
    updateActionAt({ user }) {
      return usersRef.doc(user.id).update({ lastActionAt: Date.now() })
    }
  },
  mutations: {
    [SET_USER](state, uid) {
      state.authUserId = uid
    }
  }
}
