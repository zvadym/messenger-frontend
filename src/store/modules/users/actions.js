import { UserModel } from './models'
import apiActions from './actions.api'
import socketActions from './actions.socket'

export default {
  addUser({ commit, getters }, { data }) {
    if (!getters.getById(data.id)) {
      commit(
        'addUser',
        new UserModel({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          lastActionAt: data.last_action_dt
        })
      )
    }
  },
  setAuthUser({ dispatch, commit, getters }, { id }) {
    if (!getters.getById(id)) {
      dispatch('apiGetUser', id).then(() => commit('setAuthUser', id))
    } else {
      commit('setAuthUser', id)
    }
  },
  ...apiActions,
  ...socketActions
}
