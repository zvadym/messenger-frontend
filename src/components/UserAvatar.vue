<template>
  <div class="avatar">
    <v-avatar size="30" :title="user.name">
      <!-- <v-img :src="user.avatar" /> -->
      <v-icon size="10" :color="color" class="network">mdi-brightness-1</v-icon>
    </v-avatar>
  </div>
</template>

<script>
const ONLINE_DELTA = 5 * 60 * 60 * 1000 // 5 min

export default {
  name: 'UserAvatar',
  props: {
    user: [Object]
  },
  computed: {
    color() {
      return this.isOnline ? 'green' : 'grey'
    },
    isOnline() {
      return (
        this.user.lastActionAt &&
        Date.now() - this.user.lastActionAt.getTime() < ONLINE_DELTA
      )
    }
  }
}
</script>

<style lang="sass" scoped>
.avatar
    display: inline-flex

    .network:before
        position: absolute
        bottom: -2px
        right: -2px
</style>
