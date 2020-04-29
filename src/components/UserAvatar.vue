<template>
  <div class="avatar">
    <v-avatar size="30" color="red" :title="user.fullName">
      <v-img v-if="user.avatar" :src="user.avatar" />
      <span v-else class="white--text">{{ user.initials }}</span>
      <v-icon size="10" :color="color" class="network">mdi-brightness-1</v-icon>
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    user: [Object]
  },
  computed: {
    color() {
      return this.user.isOnline ? 'green' : 'grey'
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
