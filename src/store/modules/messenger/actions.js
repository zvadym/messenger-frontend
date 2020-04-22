import { MessageModel } from './models'
import roomActions from './actions.room'
import messageActions from './actions.message'

export default {
  ...roomActions,
  ...messageActions,

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
