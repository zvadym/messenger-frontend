import { MessageModel } from './models'
import roomActions from './actions.room'
import messageActions from './actions.message'
import socketActions from './actions.socket'

export default {
  ...roomActions,
  ...messageActions,
  ...socketActions,

  // TODO: old code
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
  }
}
