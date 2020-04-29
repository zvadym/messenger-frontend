import authApi from './auth'
import roomApi from './rooms'
import userApi from './users'

export default {
  ...authApi,
  ...roomApi,
  ...userApi
}
