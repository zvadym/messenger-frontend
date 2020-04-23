<template>
  <v-footer fixed padless id="room-footer">
    <v-text-field
      label="Message.."
      append-outer-icon="send"
      ref="input"
      v-model="inputData"
      @click:append-outer="send"
      @keypress.enter="send"
    />
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      inputData: ''
    }
  },
  methods: {
    send() {
      if (this.inputData.length) {
        this.$emit('createMessage', this.inputData)
        this.$refs['input'].reset()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
#room-footer
  padding: 5px 20px
  border-top: #ccc 4px solid
</style>
