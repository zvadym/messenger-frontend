import api from '@/services/api/index'

export default {
  apiGetUsers({ dispatch }) {
    api.getAllUsers().then(data => {
      let promises = []
      data.forEach(item => promises.push(dispatch('addUser', { data: item })))
      return Promise.all(promises)
    })
  },
  apiGetUser({ commit, dispatch, getters }, userId) {
    if (!getters['getById'](userId) && !getters['isLoading'](userId)) {
      console.log('apiGetUser', userId)
      commit('addToLoadingQueue', userId)
      return api.getUserData(userId).then(payload => {
        commit('removeFromLoadingQueue', payload.id)
        return dispatch('addUser', { data: payload })
      })
    }
  },
  apiTouchUser() {
    api.updateMyStatus()
  }
}
