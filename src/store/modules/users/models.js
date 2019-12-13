import store from '@/store'
import BaseModel from '@/store/models'

export class UserModel extends BaseModel {
  fields() {
    return ['id', 'name', 'email', 'avatar']
  }

  static getById(id) {
    return new UserModel(store.getters['users/getById'](id) || {})
  }
}
