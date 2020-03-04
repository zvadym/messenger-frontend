import axios from 'axios'
import router from '@/router'
import store from '@/store'
import bus from '@/bus'

const customized = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Configure defaults
// axios.defaults.headers.common[''] =
// axios.defaults.baseURL =

// If we have a jwt token, use it
customized.interceptors.request.use(
  config => {
    if (store.getters['auth/isAuthenticated']) {
      config.headers.Authorization = `Bearer ${store.getters['auth/jwtAccess']}`
    }

    return config
    // Do something with request error
  },
  error => Promise.reject(error)
)

// Set up a response interceptor to redirect on 401 responses
// Add a response interceptor
customized.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      store.commit('auth/clearAuthCredentials')
      router.push({ name: 'Login' }).catch(error => {})
    }
    if (error.response.status > 400) {
      if (Object.prototype.hasOwnProperty.call(error.response.data, 'detail')) {
        bus.$emit('flash', error.response.data.detail, 'danger')
      }
      if (Object.prototype.hasOwnProperty.call(error.response.data, 'errors')) {
        store.commit('auth/setFormErrors', error.response.data.errors)
      }
    }
    return Promise.reject(error)
  }
)

export default customized
