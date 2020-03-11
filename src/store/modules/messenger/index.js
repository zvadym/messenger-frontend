import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  namespaced: true,
  state: {
    rooms: [],
    activeRoomId: null,
    dataLoaded: {
      messages: false
    }
  },
  getters,
  actions,
  mutations
}
