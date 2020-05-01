export default {
  getById: state => id => state.users.find(item => item.id === id),
  getAuthUser: (state, getters, rootState) =>
    rootState.auth.authUserId && getters.getById(rootState.auth.authUserId),
  isLoading: state => id => state.usersLoading.find(item => item === id)
}
