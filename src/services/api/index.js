import axios from '@/axios'

const USER_DETAILS = 'user/details/{pk}/'
const ROOMS_LIST = 'rooms/'
const ROOM_DETAILS = 'rooms/{pk}/'

export default {
  getUserData(id) {
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
  updateRoom(instance) {
    return axios.put(ROOM_DETAILS.replace('{pk}', instance.id), {
      id: instance.id,
      title: instance.title,
      members: instance.members,
      is_private: instance.isPrivate
    })
  },
  addMessage() {}
}
