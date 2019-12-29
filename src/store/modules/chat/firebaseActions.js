import { firestoreAction } from 'vuexfire'
import { channelsRef } from '@/services/firebase/index'
import { MessageModel, ChannelModel } from './models'
import { getChannelMessagesStateLabel } from './utils'

export default {
  firebaseMessageCreate: firestoreAction((context, { channelId, message }) => {
    return channelsRef
      .doc(channelId)
      .collection('messages')
      .doc(message.id)
      .set(message)
  }),
  firebaseChannelCreate: firestoreAction((context, channel) => {
    return channelsRef.doc(channel.id).set(channel)
  }),
  firebaseChannelBind: firestoreAction(({ dispatch, bindFirestoreRef }) => {
    return bindFirestoreRef('channels', channelsRef, {
      serialize: snapshot => {
        // Wrap data into the model to set all required fields
        const channel = new ChannelModel({
          ...snapshot.data(),
          id: snapshot.id
        })

        // Also bind channel messages
        dispatch('firebaseMessageBind', { channel })

        return channel
      },
      reset: false
    })
  }),
  firebaseMessageBind: firestoreAction(
    async ({ dispatch, bindFirestoreRef }, { channel }) => {
      const cRef = channelsRef.doc(channel.id).collection('messages')

      // Create "root" messages storage before binding
      await dispatch('createMessagesRoot', { channel })

      return bindFirestoreRef(getChannelMessagesStateLabel(channel), cRef, {
        serialize: snapshot => {
          // Wrap data into the model to set all required fields
          return new MessageModel({
            ...snapshot.data(),
            id: snapshot.id
          })
        },
        reset: true
      })
    }
  )
}
