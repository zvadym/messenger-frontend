export default {
  channels: state => state.channels,
  activeChannel: state =>
    state.channels.find(i => i.id === state.activeChannelId),
  activeChannelMessages: state =>
    state[`messages[${state.activeChannelId}]`] || []
}
