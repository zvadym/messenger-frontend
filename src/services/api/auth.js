import axios from '@/axios'

export default {
  login({ email, password }) {
    return axios
      .post(process.env.VUE_APP_API_LOGIN_URL, {
        username: email,
        password: password
      })
      .then(response => {
        return {
          accessToken: response.data.access,
          refreshToken: response.data.refresh
        }
      })
  },
  logout({ refreshToken }) {
    return axios.post(process.env.VUE_APP_API_LOGOUT_URL, {
      refresh: refreshToken
    })
  },
  refresh({ refreshToken }) {
    return axios.post(process.env.VUE_APP_API_REFRESH_URL, {
      refresh: refreshToken
    })
  },
  verify({ refreshToken }) {
    return axios.post(process.env.VUE_APP_API_VERIFY_URL, {
      token: refreshToken
    })
  }
}
