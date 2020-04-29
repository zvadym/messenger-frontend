import axios from '@/axios'

const ROOMS_LIST = 'rooms/'
const ROOM_DETAILS = 'rooms/{pk}/'
const MESSAGE_LIST = 'rooms/{room_pk}/messages/'

export default {
  getRooms() {
    return axios.get(ROOMS_LIST).then(response => response.data)
  },
  createRoom(instance) {
    return axios
      .post(ROOMS_LIST, {
        title: instance.title,
        is_private: instance.isPrivate,
        members: instance.memberIds
      })
      .then(response => response.data)
  },
  updateRoom(instance) {
    return axios.put(ROOM_DETAILS.replace('{pk}', instance.id), {
      id: instance.id,
      title: instance.title,
      members: instance.members,
      is_private: instance.isPrivate
    })
  },
  createMessage(instance) {
    return axios
      .post(MESSAGE_LIST.replace('{room_pk}', instance.roomId), {
        message: instance.message
      })
      .then(response => response.data)
  },
  getMessages(roomId) {
    return axios
      .get(MESSAGE_LIST.replace('{room_pk}', roomId))
      .then(response => response.data)
  }
}
