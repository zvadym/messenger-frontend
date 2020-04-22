export default {
  setAccessToken(state, token) {
    state.jwtAccess = token
  },
  setRefreshToken(state, token) {
    state.jwtRefresh = token
  },
  clearAuthCredentials(state) {
    state.jwtAccess = null
    state.jwtRefresh = null
  },
  updateTimeoutId(state, timeoutId) {
    state.timeoutId = timeoutId
  }
}
