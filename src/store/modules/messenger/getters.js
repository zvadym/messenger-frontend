export default {
  rooms: state => state.rooms,
  getById: state => cid => state.rooms.find(c => c.id === cid),
  activeRoom: state => state.rooms.find(i => i.id === state.activeRoomId),
  activeRoomMessages: state => state[`messages[${state.activeRoomId}]`] || []
}
