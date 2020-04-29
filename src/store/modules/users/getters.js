export default {
  getById: state => id => state.users.find(item => item.id === id),
  getAuthUser: (state, getters) =>
    state.authUserId && getters.getById(state.authUserId),
  isLoading: state => id => state.usersLoading.find(item => item === id)
}
