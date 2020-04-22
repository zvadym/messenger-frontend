export default {
  isAuthenticated(state) {
    return state.jwtAccess !== null
  },
  jwtAccess(state) {
    return state.jwtAccess
  }
}
