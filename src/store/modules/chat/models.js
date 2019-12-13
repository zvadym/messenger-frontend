import BaseModel from '@/store/models'
import { UserModel } from '@/store/modules/users/models'

export class MessageModel extends BaseModel {
  fields() {
    return ['id', 'author', 'authorId', 'message', 'createdAt']
  }

  defaults() {
    return {
      id: this.guid(),
      createdAt: Date.now()
    }
  }

  get_author_value(field, modelData) {
    return UserModel.getById(modelData.authorId)
  }
}
