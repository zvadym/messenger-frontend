export default {
  channels: state => state.channels,
  getById: state => cid => state.channels.find(c => c.id === cid),
  activeChannel: state =>
    state.channels.find(i => i.id === state.activeChannelId),
  activeChannelMessages: state =>
    state[`messages[${state.activeChannelId}]`] || []
}
