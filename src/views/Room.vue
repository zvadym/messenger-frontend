<template>
  <v-container id="messenger-area" fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <ul class="messages" v-if="messages.length">
          <div v-for="item in messages" :key="'message-' + item.id">
            <Notice v-if="item.isNotice" :data="item" />
            <Message v-else :data="item" />
          </div>
        </ul>
        <EmptyRoom v-if="!messages.length" />
      </v-col>
    </v-row>

    <NewMessageInput @createMessage="createMessage" />
  </v-container>
</template>

<script>
import NewMessageInput from '@/components/NewMessageInput'
import Message from '@/components/Message'
import Notice from '@/components/Notice'
import EmptyRoom from '@/components/EmptyRoom'

export default {
  components: { NewMessageInput, Message, Notice, EmptyRoom },
  data() {
    return {
      lastMessageAt: null // use for "scroll to the end"
    }
  },
  computed: {
    room() {
      return this.$store.getters['messenger/activeRoom']
    },
    messages() {
      return this.$store.getters['messenger/activeRoomMessages']
    }
  },
  watch: {
    $route: function() {
      console.log('TODO: New room selected. Refetch data')
    },
    messages: function(newVal) {
      const newMsg = newVal[newVal.length - 1]

      // Detect a new message comparing `lastMessageAt` with message's `createdAt`
      if (newMsg && newMsg.createdAt > this.lastMessageAt) {
        this.$nextTick(this.scrollToBottom)
        this.lastMessageAt = newMsg.createdAt
      }
    }
  },
  methods: {
    createMessage(message) {
      this.$store.dispatch('messenger/addMessage', { message })
    },
    scrollToBottom() {
      document
        .getElementById('root-content')
        .scrollIntoView(false, { block: 'end' })
    }
  },
  mounted: function() {
    // Check/set active room
    if (this.$route.params.id) {
      this.$store.dispatch('messenger/setActiveRoom', {
        id: this.$route.params.id
      })
    }

    if (!this.room) {
      // Select the first room
      this.$store.dispatch('messenger/setDefaultActiveRoom')
    }
  }
}
</script>

<style scoped>
#messenger-area {
  align-items: flex-start;
}
.messages {
  padding: 0;
  list-style: none;
}
</style>
