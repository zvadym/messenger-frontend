import axios from '@/axios'

const USER_DETAILS = 'user/details/{pk}/'
const ROOMS_LIST = 'rooms/'

export default {
  getUserData(id) {
    console.log('getUserData', id)
    return axios.get(USER_DETAILS.replace('{pk}', id)).then(response => {
      return response.data
    })
  },
  getRooms() {
    return axios.get(ROOMS_LIST).then(response => {
      return response.data
    })
  },
  createRoom(instance) {
    console.log('Create a new room', instance)
    return axios
      .post(ROOMS_LIST, {
        title: instance.title,
        is_private: instance.isPrivate,
        members: instance.memberIds
      })
      .then(response => {
        return response.data
      })
  },
  addMessage() {}
}
