import { UserModel } from './models'
import apiActions from './actions.api'
import socketActions from './actions.socket'

export const dataToModel = data =>
  new UserModel({
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    lastActionAt: data.last_action_dt
  })

export default {
  addUser({ commit, dispatch, getters }, { data }) {
    if (!getters.getById(data.id)) {
      const user = dataToModel(data)

      commit('addUser', user)
      return dispatch('socketConnectToMember', data.id, { root: true }).then(
        () => user
      )
    }
  },
  ...apiActions,
  ...socketActions
}
