import { UserModel } from './models'
export const ADD_USER = 'ADD_USER'
export const SET_AUTH_USER = 'SET_AUTH_USER'

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
    addUser({ commit, getters }, payload) {
      if (!getters['getById'](payload.id)) {
        commit(
          ADD_USER,
          new UserModel({
            id: payload.id,
            email: payload.email,
            firstName: payload.first_name,
            lastName: payload.last_name
          })
        )
      }
    },
    setAuthUser({ commit }, payload) {
      commit(SET_AUTH_USER, payload.id)
    },
    updateActionAt() {
      console.log('TODO: updateActionAt')
    }
  },
  mutations: {
    [SET_AUTH_USER](state, uid) {
      state.authUserId = uid
    },
    [ADD_USER](state, user) {
      state.users.push(user)
    }
  }
}
