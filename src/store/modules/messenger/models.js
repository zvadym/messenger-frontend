import BaseModel from '@/store/models'

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
      'isPrivate',

      'messages'
    ]
  }

  defaults() {
    return {
      id: this.guid(),
      createdAt: Date.now(),
      userTyping: false,
      isPrivate: true,
      messages: []
    }
  }
}
