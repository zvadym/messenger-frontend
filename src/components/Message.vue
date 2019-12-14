<template>
  <li
    :class="{
      item: true,
      rightSide: isMyMessage,
      leftSide: !isMyMessage
    }"
  >
    <v-avatar size="30" class="avatar" v-if="!isMyMessage">
      <v-img :src="avatar" />
    </v-avatar>
    <div class="message body-2 primary white--text">
      {{ data.message }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'ChatMessage',
  props: {
    data: [Object]
  },
  computed: {
    avatar: function() {
      return this.data.author.avatar
    },
    isMyMessage: function() {
      return this.$store.getters['users/authUser'].id === this.data.author.id
    }
  }
}
</script>

<style lang="sass" scoped>
.item
  margin: 20px 0

  .message
    display: inline-block
    border: 1px solid #ccc
    border-radius: 12px
    padding: 5px 10px

  &.leftSide
    .avatar
      position: absolute
    .message
      margin-left: 35px
      margin-right: 50px
  &.rightSide
    .message
      float: right
      margin-left: 50px
</style>
