<template>
  <v-list flat dense>
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-pound</v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        Channels
        <v-btn
          color="grey darken-2"
          dark
          x-small
          absolute
          right
          outlined
          :to="{ name: 'new-channel' }"
          >new</v-btn
        >
      </v-list-item-title>
    </v-list-item>

    <v-list-item-group v-model="activeChannel" color="primary">
      <v-list-item v-for="item in channels" :key="item.id" :value="item.id">
        <v-list-item-icon>
          <v-icon>mdi-circle-medium</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'ChannelsList',
  computed: {
    activeChannel: {
      get: function() {
        return this.$store.state.chat.activeChannelId
      },
      set: function(id) {
        this.$store.dispatch('chat/setActiveChannel', { id }).then(() => {
          this.$router.push({ name: 'channel', params: { id } })
        })
        this.$emit('closeMenu')
      }
    },
    channels() {
      return this.$store.getters['chat/channels']
    }
  }
}
</script>
