import { UserModel } from './models'
import api from '@/services/api/index'

export default {
  namespaced: true,
  state: {
    authUserId: null,
    users: [],
    usersLoading: []
  },
  getters: {
    getById: state => id => state.users.find(item => item.id === id),
    getByName: state => name => state.users.find(item => item.name === name),
    getAuthUser: (state, getters) =>
      state.authUserId && getters.getById(state.authUserId),
    isLoading: state => id => state.usersLoading.find(item => item === id)
  },
  actions: {
    addUser({ commit, getters }, userId) {
      if (!getters['getById'](userId) && !getters['isLoading'](userId)) {
        commit('addToLoadingQueue', userId)

        api.getUserData(userId).then(payload => {
          console.log('Loaded:', payload)

          commit(
            'addUser',
            new UserModel({
              id: payload.id,
              email: payload.email,
              firstName: payload.first_name,
              lastName: payload.last_name
            })
          )
          commit('removeFromLoadingQueue', payload.id)
        })
      }
    },
    setAuthUser({ commit }, payload) {
      commit('setAuthUser', payload.id)
    },
    updateActionAt() {
      console.log('TODO: updateActionAt')
    }
  },
  mutations: {
    setAuthUser(state, uid) {
      state.authUserId = uid
    },
    addToLoadingQueue(state, uid) {
      state.usersLoading.push(uid)
    },
    removeFromLoadingQueue(state, uid) {
      state.usersLoading.splice(state.usersLoading.indexOf(uid), 1)
    },
    addUser(state, user) {
      state.users.push(user)
    }
  }
}
