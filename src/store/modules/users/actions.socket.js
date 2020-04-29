import { UserModel } from './models'

export default {
  socket__updateUser({ commit }, payload) {
    commit(
      'updateUser',
      new UserModel({
        id: payload.id,
        email: payload.email,
        firstName: payload.first_name,
        lastName: payload.last_name,
        lastActionAt: payload.last_action_dt
      })
    )
  }
}
