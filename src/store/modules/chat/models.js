import BaseModel from '@/store/models'

export class MessageModel extends BaseModel {
  fields() {
    return ['id', 'channelId', 'authorId', 'message', 'createdAt']
  }

  defaults() {
    return {
      id: this.guid(),
      createdAt: Date.now()
    }
  }
}

export class ChannelModel extends BaseModel {
  fields() {
    return [
      'id',
      'title',
      'authorId',
      'memberIds',
      'createdAt',
      'lastMessageAt',
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
}
