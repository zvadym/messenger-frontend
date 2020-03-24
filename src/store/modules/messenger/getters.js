export default {
  rooms: state => state.rooms,
  getById: state => cid => state.rooms.find(c => c.id === cid),
  getByTitle: state => title => state.rooms.find(c => c.title === title),
  activeRoom: state => state.rooms.find(i => i.id === state.activeRoomId),
  activeRoomMessages: state => state[`messages[${state.activeRoomId}]`] || []
}
