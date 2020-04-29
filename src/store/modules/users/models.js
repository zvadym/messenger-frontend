import store from '@/store'
import BaseModel from '@/store/models'

const ONLINE_DELTA = 5 * 60 * 60 * 1000 // 5 min

export class UserModel extends BaseModel {
  fields() {
    return [
      'id',
      'fistName',
      'lastName',
      'email',
      'avatar',
      'lastActionAt',
      'initials'
    ]
  }

  defaults() {
    return {
      lastActionAt: Date.now()
    }
  }

  get_initials_value(field, modelData) {
    return `${modelData['firstName'][0]}${modelData['lastName'][0]}`.toUpperCase()
  }

  get_lastActionAt_value(field, modelData) {
    const val = modelData[field]
    if (!val) {
      return null
    }
    return new Date(val)
  }

  get fullName() {
    return this.lastName
  }

  static getById(id) {
    return new UserModel(store.getters['users/getById'](id) || {})
  }

  get isOnline() {
    return (
      this.lastActionAt &&
      Date.now() - this.lastActionAt.getTime() < ONLINE_DELTA
    )
  }
}
