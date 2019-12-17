import store from '@/store'
import BaseModel from '@/store/models'

export class UserModel extends BaseModel {
  fields() {
    return ['id', 'name', 'email', 'avatar', 'lastActionAt']
  }

  defaults() {
    return {
      lastActionAt: Date.now()
    }
  }

  get_lastActionAt_value(field, modelData) {
    const val = modelData[field]
    if (!val) {
      return null
    }
    return new Date(val)
  }

  static getById(id) {
    return new UserModel(store.getters['users/getById'](id) || {})
  }
}
