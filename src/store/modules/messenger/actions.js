import roomActions from './actions.room'
import messageActions from './actions.message'
import socketActions from './actions.socket'

export default {
  ...roomActions,
  ...messageActions,
  ...socketActions
}
