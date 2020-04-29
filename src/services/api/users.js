import axios from '@/axios'

const USER_LIST = 'user/list/'
const USER_DETAILS = 'user/{pk}/details/'
const USER_PING = 'user/my/ping/'

export default {
  updateMyStatus() {
    return axios.put(USER_PING, {}).then(response => response.data)
  },
  getUserData(id) {
    return axios
      .get(USER_DETAILS.replace('{pk}', id))
      .then(response => response.data)
  },
  getAllUsers() {
    return axios.get(USER_LIST).then(response => response.data)
  }
}
