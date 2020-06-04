import axios from '@/axios'

const ROOMS_LIST = 'rooms/'
const ROOM_DETAILS = 'rooms/{pk}/'
const MESSAGE_LIST = 'rooms/{room_pk}/messages/'
const NOTIFICATION_LIST = 'rooms/{room_pk}/notifications/'

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
    return axios
      .put(ROOM_DETAILS.replace('{pk}', instance.id), {
        id: instance.id,
        title: instance.title,
        members: instance.memberIds,
        is_private: instance.isPrivate
      })
      .then(response => response.data)
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
  },
  getNotifications(roomId) {
    return axios
      .get(NOTIFICATION_LIST.replace('{room_pk}', roomId))
      .then(response => response.data)
  }
}
