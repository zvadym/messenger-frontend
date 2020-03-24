import { MessageModel } from './models'
import { getRoomMessagesStateLabel } from './utils'
import roomActions from './actions.room'
import messageActions from './actions.message'

export default {
  ...roomActions,
  ...messageActions,

  // TODO: old code
  addMessage({ dispatch, state, rootState }, payload) {
    const message = new MessageModel({
      message: payload.message,
      authorId: rootState.users.authUserId
    })

    console.log('TODO: AddMessage', message)

    // dispatch('firebaseMessageCreate', {
    //   roomId: state.activeRoomId,
    //   message: message.toDict()
    // })
  },
  addNotice({ dispatch }, { message, room }) {
    const notice = new MessageModel({
      message,
      isNotice: true
    })

    console.log('TODO: AddNotice', notice)

    // dispatch('firebaseMessageCreate', {
    //   roomId: room.id,
    //   message: notice.toDict()
    // })
  },

  setDefaultActiveRoom({ commit, getters, dispatch }) {
    const rooms = getters.rooms

    if (!rooms.length) {
      // Create a new room and set it as "Active"
      dispatch('createRoom', { title: 'master', isPrivate: false }).then(
        room => {
          commit('setActiveRoom', room.id)
        }
      )
    } else {
      commit('setActiveRoom', rooms[0].id)
    }
  },
  createMessagesRoot({ commit }, { room }) {
    commit('createMessagesRoot', getRoomMessagesStateLabel(room))
  }
}
