import jwtDecode from 'jwt-decode'
import bus from '@/bus'
import axios from '@/axios'
import router from '@/router'

export default {
  login({ dispatch }, credentials) {
    return axios
      .post(process.env.VUE_APP_API_LOGIN_URL, {
        username: credentials.email,
        password: credentials.password
      })
      .then(response => {
        const accessToken = response.data.access
        const refreshToken = response.data.refresh

        window.localStorage.setItem('auth_refresh_token', refreshToken)

        dispatch('updateRefreshToken', refreshToken)
          .then(() => {
            return dispatch('updateAccessToken', accessToken)
          })
          .then(() => {
            // Go to "home" page
            router.push({ name: 'home' })
          })
      })
      .catch(error => {
        throw error
        // (!) Also see axios config for basic error handling
      })
  },
  logout({ commit, state }) {
    return axios
      .post(process.env.VUE_APP_API_LOGOUT_URL, {
        refresh: state.jwtRefresh
      })
      .then(() => {
        commit('clearAuthCredentials')
        commit('clearUserData')
        window.localStorage.removeItem('auth_refresh_token')

        bus.$emit('flash', 'Goodbye! Your session has ended.', 'success')
        router.push({ name: 'login' })
      })
  },
  refresh({ dispatch, state }) {
    const refreshToken = state.jwtRefresh

    return axios
      .post(process.env.VUE_APP_API_REFRESH_URL, {
        refresh: refreshToken
      })
      .then(response => {
        dispatch('updateAccessToken', response.data.access)
        bus.$emit('flash', 'Access token is updated')
      })
      .catch(() => {
        throw new Error('Bad refresh token')
      })
  },
  verify({ state }) {
    return axios
      .post(process.env.VUE_APP_API_VERIFY_URL, {
        token: state.jwtRefresh
      })
      .then(() => {
        bus.$emit('flash', 'Current token is valid!', 'info')
      })
      .catch(() => {
        bus.$emit('flash', 'Current token is invalid!', 'danger')
      })
  },
  updateAccessToken({ commit, dispatch }, token) {
    // Refresh "access" token when it expires
    dispatch('setRefreshTimer', new Date(jwtDecode(token).exp * 1000))

    commit('setAccessToken', token)
    dispatch('socketConnect', null, { root: true })
  },
  updateRefreshToken({ dispatch, commit }, token) {
    const tokenData = jwtDecode(token)
    dispatch('users/setAuthUser', { id: tokenData.user_id }, { root: true })
    return commit('setRefreshToken', token)
  },
  setRefreshTimer({ state, commit, dispatch }, expirationTime) {
    clearTimeout(state.timeoutId)

    const timeoutId = setTimeout(() => {
      bus.$emit('flash', 'Access token is expired')
      dispatch('refresh')
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

    return dispatch('updateRefreshToken', refreshToken).then(() => {
      return dispatch('refresh').then(
        () => {
          bus.$emit('flash', 'Autologin => success')
          router.push({ name: 'home' })
        },
        error => {
          bus.$emit('flash', `Autologin failded - ${error.message}`, 'warning')
        }
      )
    })
  }
}
