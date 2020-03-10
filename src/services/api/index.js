import axios from '@/axios'

const ROOMS_LIST = 'rooms/'

export default {
  getUserData() {},
  getRooms() {
    return axios.get(ROOMS_LIST).then(response => {
      return response.data
    })
  },
  createRoom() {},
  addMessage() {}
}
