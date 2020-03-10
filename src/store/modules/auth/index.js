import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    jwtAccess: null,
    jwtRefresh: null,

    timeoutId: null,

    userData: null
  },
  getters,
  actions,
  mutations
}
