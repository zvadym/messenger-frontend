export default {
  isAuthenticated(state) {
    return state.jwtAccess !== null
  },
  jwtAccess(state) {
    return state.jwtAccess
  },
  userEmail(state) {
    return state.userData.email
  },
  userName(state) {
    return state.userData.fullName
  }
}
