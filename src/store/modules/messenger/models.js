import store from '@/store'
import BaseModel from '@/store/models'

export class RoomModel extends BaseModel {
  fields() {
    return [
      'id',
      'title',
      'authorId',
      'memberIds',
      'createdAt',
      'updatedAt',
      'userTyping',
      'isPrivate'
    ]
  }

  defaults() {
    return {
      id: this.guid(),
      createdAt: Date.now(),
      userTyping: false,
      isPrivate: true
    }
  }

  get author() {
    return store.getters['users/getById'](this.authorId)
  }
}

export class MessageModel extends BaseModel {
  fields() {
    return ['id', 'roomId', 'isNotice', 'authorId', 'message', 'createdAt']
  }

  defaults() {
    return {
      createdAt: Date.now(),
      isNotice: false
    }
  }
}
