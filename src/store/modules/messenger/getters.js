import _ from 'lodash'

export default {
  rooms: state => state.rooms,
  roomsOrdered: state => _.orderBy(state.rooms, ['updatedAt'], ['desc']),
  getById: state => cid => state.rooms.find(c => c.id === cid),
  getByTitle: state => title => state.rooms.find(c => c.title === title),
  activeRoom: state => state.rooms.find(i => i.id === state.activeRoomId),
  roomMessages: state => rid =>
    _.orderBy(
      state.messages.filter(m => m.roomId === rid),
      ['createdAt'],
      ['asc']
    )
}
