import jwtDecode from 'jwt-decode'
import bus from '@/bus'
import api from '@/services/api/index'

export default {
  login({ dispatch }, { email, password }) {
    return api
      .login({ email, password })
      .then(({ accessToken, refreshToken }) => {
        window.localStorage.setItem('auth_refresh_token', refreshToken)
        return dispatch('updateRefreshToken', refreshToken).then(() =>
          dispatch('updateAccessToken', accessToken)
        )
      })
      .catch(error => {
        throw error
        // (!) Also see axios config for basic error handling
      })
  },
  logout({ commit, state }) {
    return api.logout({ refreshToken: state.jwtRefresh }).then(() => {
      commit('clearAuthCredentials')
      window.localStorage.removeItem('auth_refresh_token')
      return true
    })
  },
  refreshAccessToken({ dispatch, state }) {
    return api
      .refresh({ refreshToken: state.jwtRefresh })
      .then(response => {
        bus.$emit('flash', 'Access token is updated')
        return dispatch('updateAccessToken', response.data.access)
      })
      .catch(() => {
        throw new Error('Bad refresh token')
      })
  },
  verify({ state }) {
    return api.verify({ refreshToken: state.jwtRefresh })
  },
  updateAccessToken({ commit, dispatch }, token) {
    commit('setAccessToken', token)

    // Set current AuthUser
    return dispatch(
      'users/setAuthUser',
      { id: jwtDecode(token).user_id },
      { root: true }
    ).then(() =>
      // Refresh "access" token when it expires
      dispatch(
        'setRefreshTimer',
        new Date(jwtDecode(token).exp * 1000)
      ).then(() => dispatch('socketConnect', null, { root: true }))
    )
  },
  updateRefreshToken({ commit }, token) {
    commit('setRefreshToken', token)
    return token
  },
  setRefreshTimer({ state, commit, dispatch }, expirationTime) {
    clearTimeout(state.timeoutId)

    const timeoutId = setTimeout(() => {
      bus.$emit('flash', 'Access token is expired')
      dispatch('refreshAccessToken')
    }, expirationTime - new Date())

    return commit('updateTimeoutId', timeoutId)
  },
  tryAutoLogin({ commit, dispatch }) {
    const refreshToken = window.localStorage.getItem('auth_refresh_token')

    if (!refreshToken) {
      return
    }

    const expirationDate = new Date(jwtDecode(refreshToken).exp * 1000)

    if (new Date() >= expirationDate) {
      bus.$emit('flash', 'Autologin is failed. Tokes is expired.', 'warning')
      window.localStorage.removeItem('auth_refresh_token')
      commit('clearAuthCredentials')
      return
    }

    return dispatch('updateRefreshToken', refreshToken)
      .then(() => dispatch('refreshAccessToken'))
      .then(() => bus.$emit('flash', 'Autologin => success'))
      .catch(error =>
        bus.$emit('flash', `Autologin failded - ${error.message}`, 'warning')
      )
  }
}
