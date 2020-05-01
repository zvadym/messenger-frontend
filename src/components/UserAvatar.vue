<template>
  <div class="avatar">
    <v-avatar size="30" color="blue lighten-1" :title="user.fullName">
      <v-img v-if="user.avatar" :src="user.avatar" />
      <span v-else class="white--text">{{ user.initials }}</span>
    </v-avatar>
    <v-icon size="10" :color="color" class="network">mdi-brightness-1</v-icon>
  </div>
</template>

<script>
const ONLINE_DELTA = 3 * 60 * 1000 // 1 min

export default {
  name: 'UserAvatar',
  props: {
    user: [Object]
  },
  data() {
    return {
      now: Date.now()
    }
  },
  computed: {
    isOnline() {
      return (
        this.user.lastActionAt &&
        this.now - this.user.lastActionAt.getTime() < ONLINE_DELTA
      )
    },
    color() {
      return this.isOnline ? 'green' : 'grey'
    }
  },
  created() {
    setInterval(() => {
      this.now = Date.now()
    }, 10 * 1000)
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
