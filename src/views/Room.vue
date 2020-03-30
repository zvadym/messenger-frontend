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
      updatedAt: null // use for "scroll to the end"
    }
  },
  computed: {
    room() {
      return this.$store.getters['messenger/activeRoom']
    },
    messages() {
      if (!this.room) {
        return []
      }
      return this.$store.getters['messenger/roomMessages'](this.room.id) || []
    }
  },
  watch: {
    $route: function() {
      this.initRoom()
    },
    messages: function(newVal) {
      console.log('TODO: watch room messages')
      const newMsg = newVal[newVal.length - 1]

      // Detect a new message comparing `updatedAt` with message's `createdAt`
      if (newMsg && newMsg.createdAt > this.updatedAt) {
        this.$nextTick(this.scrollToBottom)
        this.updatedAt = newMsg.createdAt
      }
    }
  },
  methods: {
    initRoom() {
      if (!this.messages.length) {
        // Load messages
        this.$store.dispatch('messenger/loadMessages', { room: this.room })
      }
    },
    createMessage(message) {
      this.$store.dispatch('messenger/createMessage', { message })
    },
    scrollToBottom() {
      document
        .getElementById('root-content')
        .scrollIntoView(false, { block: 'end' })
    }
  },
  beforeMount: function() {
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
  },
  mounted: function() {
    this.initRoom()
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
