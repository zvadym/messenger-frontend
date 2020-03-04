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
    return state.userData.name
  },
  hasValidationError: state => input => {
    return Object.prototype.hasOwnProperty.call(state.formErrors, input)
  },
  getValidationError: state => input => {
    if (Object.prototype.hasOwnProperty.call(state.formErrors, input)) {
      const error = state.formErrors[input]
      return Array.isArray(error) ? error[0] : error
    }
    return null
  }
}
