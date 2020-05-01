import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    users: [],
    usersLoading: []
  },
  getters,
  actions,
  mutations
}
