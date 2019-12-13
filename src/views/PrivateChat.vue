<template>
  <v-container id="chat-area" fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <v-list rounded>
          <Message
            v-for="(item, i) in messages"
            :key="i + 'message'"
            :data="item"
          />
        </v-list>
      </v-col>
    </v-row>

    <NewMessageInput @createMessage="createMessage" />
  </v-container>
</template>

<script>
import NewMessageInput from '@/components/NewMessageInput'
import Message from '@/components/Message'

export default {
  components: { NewMessageInput, Message },
  computed: {
    messages() {
      return this.$store.getters['chat/messages']
    }
  },
  methods: {
    createMessage(message) {
      this.$store.dispatch('chat/addMessage', { message })
    }
  },
  mounted: function() {
    // firebase sync
    this.$store.dispatch('chat/firebaseBind')
  }
}
</script>

<style scoped>
#chat-area {
  align-items: flex-start;
}
</style>
