<template>
  <li
    class="item mx-0 my-3"
    :class="{
      rightSide: isMyMessage,
      leftSide: !isMyMessage
    }"
  >
    <UserAvatar :user="author" v-if="!isMyMessage" />

    <div class="message body-2 primary white--text">
      {{ data.message }}
    </div>
    <div class="clearfix"></div>
  </li>
</template>

<script>
import UserAvatar from './UserAvatar'

export default {
  name: 'Message',
  props: {
    data: Object
  },
  components: { UserAvatar },
  computed: {
    author() {
      return this.$store.getters['users/getById'](this.data.authorId)
    },
    isMyMessage() {
      return this.$store.state.auth.authUserId === this.data.authorId
    }
  }
}
</script>

<style lang="sass" scoped>
.item
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

  .clearfix
    clear: both
</style>
