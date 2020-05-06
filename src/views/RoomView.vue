<template>
  <v-container id="messenger-area" fill-height>
    <v-row no-gutters>
      <v-col cols="12">
        <RoomContent v-if="loaded" :roomInstance="room" />
        <Loading v-else />
      </v-col>
    </v-row>

    <RoomMessageInput @createMessage="createMessage" />
  </v-container>
</template>

<script>
import RoomMessageInput from '@/components/RoomMessageInput'
import RoomContent from '@/components/RoomContent'
import Loading from '@/components/Loading'

export default {
  components: { RoomMessageInput, RoomContent, Loading },
  data() {
    return {
      messagesLoaded: false
    }
  },
  computed: {
    loaded() {
      return this.messagesLoaded
    },
    room() {
      return this.$store.getters['messenger/getRoomById'](this.$route.params.id)
    }
  },
  watch: {
    room: function() {
      this.initRoom()
    }
  },
  methods: {
    initRoom() {
      this.$store.dispatch('messenger/setActiveRoom', { id: this.room.id })

      if (this.$store.getters['messenger/roomMessages'](this.room.id).length) {
        this.messagesLoaded = true
      } else {
        this.messagesLoaded = false

        // Load messages (get from the api)
        this.$store
          .dispatch('messenger/loadMessages', { room: this.room })
          .then(() => {
            this.messagesLoaded = true
          })
      }
    },
    createMessage(message) {
      this.$store.dispatch('messenger/createMessage', { message })
    }
  },
  beforeMount: async function() {
    let roomId = this.$route.params.id

    if (roomId && this.$store.getters['messenger/getRoomById'](roomId)) {
      return true
    }

    // If no room specified - select the first active one.
    // If no rooms were created at all - create a new one.
    const rooms = this.$store.getters['messenger/roomsOrdered']

    if (!rooms.length) {
      const room = await this.$store.dispatch('messenger/createRoom', {
        title: 'master',
        isPrivate: false
      })
      roomId = room.id
    } else {
      roomId = rooms[0].id
    }

    this.$router.push({
      name: 'room',
      params: { id: roomId }
    })
  },
  mounted() {
    if (this.room) {
      this.initRoom()
    }
  }
}
</script>

<style scoped>
#messenger-area {
  align-items: flex-start;
}
</style>
