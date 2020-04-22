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
    getAuthUser: (state, getters) =>
      state.authUserId && getters.getById(state.authUserId),
    isLoading: state => id => state.usersLoading.find(item => item === id)
  },
  actions: {
    addUser({ commit, getters }, userId) {
      if (!getters['getById'](userId) && !getters['isLoading'](userId)) {
        return api.getUserData(userId).then(payload => {
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
    setAuthUser({ dispatch, commit, getters }, { id }) {
      if (!getters.getById(id)) {
        dispatch('addUser', id).then(() => commit('setAuthUser', id))
      } else {
        commit('setAuthUser', id)
      }
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
