export const SET_USER = 'SET_USER'

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    user: state => state.user
  },
  actions: {
    setUser({ commit }, payload) {
      commit(
        SET_USER,
        payload
          ? {
              uid: payload.uid,
              name: payload.displayName,
              email: payload.email,
              avatar: payload.photoURL
            }
          : null
      )
    }
  },
  mutations: {
    [SET_USER](state, user) {
      state.user = user
    }
  }
}
