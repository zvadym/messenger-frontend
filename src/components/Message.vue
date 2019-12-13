<template>
  <v-list-item>
    <v-list-item-avatar v-if="!isMyMessage">
      <v-img v-if="avatar" :src="avatar"></v-img>
    </v-list-item-avatar>

    <v-list-item-content color="blue">{{ data.message }}</v-list-item-content>
  </v-list-item>
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
    },
    color: () => 'primary'
  }
}
</script>
