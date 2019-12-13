import uniqueId from '@/utils/unique-id'
import { tsConstructSignatureDeclaration } from '@babel/types'

export default class BaseModel {
  constructor(data) {
    data = data || {}
    this.fields().forEach(field => {
      Object.defineProperty(this, field, {
        value: this.getFieldValue(field, data),
        writable: false,
        enumerable: true
      })
    })
  }

  fields() {
    // return [...]
    throw 'Fields not defined'
  }

  defaults() {
    // Default values
    return {}
  }

  getFieldValue(field, modelData) {
    const methodName = `get_${field}_value`

    if (typeof this[methodName] === 'function') {
      return this[methodName](field, modelData)
    }

    return modelData[field] !== undefined
      ? modelData[field]
      : this.defaults()[field] !== undefined
      ? this.defaults()[field]
      : null
  }

  toDict({ fields = [], exclude = [] } = {}) {
    let dict = {}

    if (!fields.length) {
      fields = Object.keys(this)
    }

    if (exclude) {
      fields = fields.filter(item => exclude.indexOf(item) === -1)
    }

    fields.map(key => {
      const val = this[key]
      if (val && typeof val.toDict === 'function') {
        dict[key] = val.toDict()
      } else {
        dict[key] = val
      }
    })

    return dict
  }

  guid() {
    return uniqueId()
  }
}
