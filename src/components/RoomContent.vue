<template>
  <ul v-if="messages.length" id="messages" ref="messages">
    <div v-for="item in messages" :key="'message-' + item.id">
      <Notification v-if="item.isNotification" :data="item" />
      <RoomMessage v-else :data="item" />
    </div>
  </ul>
  <RoomEmpty v-else />
</template>

<script>
import RoomEmpty from './RoomEmpty'
import RoomMessage from './RoomMessage'
import Notification from './Notification'

export default {
  components: { RoomEmpty, RoomMessage, Notification },
  props: {
    roomInstance: [Object]
  },
  data() {
    return {
      updatedAt: null // use for "scroll to the end"
    }
  },
  computed: {
    messages() {
      return (
        this.$store.getters['messenger/roomMessages'](this.roomInstance.id) ||
        []
      )
    }
  },
  watch: {
    messages: function(newVal) {
      const newMsg = newVal[newVal.length - 1]
      // Detect a new message comparing `updatedAt` with message's `createdAt`
      if (newMsg && newMsg.createdAt > this.updatedAt) {
        this.$nextTick(this.scrollToBottom)
        this.updatedAt = newMsg.createdAt
      }
    },
    roomInstance: function() {
      this.scrollToBottom()
    }
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messages.scrollIntoView(false, { block: 'end' })
      })
    }
  },
  mounted() {
    if (this.messages.length) {
      this.updatedAt = this.messages[this.messages.length - 1].createdAt
      this.scrollToBottom()
    }
  }
}
</script>

<style scoped>
#messages {
  padding: 0 0 75px 0;
  list-style: none;
}
</style>
