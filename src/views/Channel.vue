<template>
  <v-container id="chat-area" fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <ul class="messages" v-if="messages.length">
          <div v-for="item in messages" :key="'message-' + item.id">
            <Notice v-if="item.isNotice" :data="item" />
            <Message v-else :data="item" />
          </div>
        </ul>
        <EmptyChat v-if="!messages.length" />
      </v-col>
    </v-row>

    <NewMessageInput @createMessage="createMessage" />
  </v-container>
</template>

<script>
import NewMessageInput from '@/components/NewMessageInput'
import Message from '@/components/Message'
import Notice from '@/components/Notice'
import EmptyChat from '@/components/EmptyChat'

export default {
  components: { NewMessageInput, Message, Notice, EmptyChat },
  data() {
    return {
      lastMessageAt: null // use for "scroll to the end"
    }
  },
  computed: {
    channel() {
      return this.$store.getters['chat/activeChannel']
    },
    messages() {
      return this.$store.getters['chat/activeChannelMessages']
    }
  },
  watch: {
    $route: function() {
      console.log('TODO: New channel selected. Refetch data')
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
      this.$store.dispatch('chat/addMessage', { message })
    },
    scrollToBottom() {
      document
        .getElementById('root-content')
        .scrollIntoView(false, { block: 'end' })
    }
  },
  mounted: function() {
    // Check/set active channel
    if (this.$route.params.id) {
      this.$store.dispatch('chat/setActiveChannel', {
        id: this.$route.params.id
      })
    }

    if (!this.channel) {
      // Select the first channel
      this.$store.dispatch('chat/setDefaultActiveChannel')
    }
  }
}
</script>

<style scoped>
#chat-area {
  align-items: flex-start;
}
.messages {
  padding: 0;
  list-style: none;
}
</style>
