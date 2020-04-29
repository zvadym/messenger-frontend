export default {
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
  },
  updateUser(state, user) {
    state.users = [
      ...state.users.filter(element => element.id !== user.id),
      user
    ]
  }
}
