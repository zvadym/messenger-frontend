<template>
  <v-footer app padless class="px-2 pb-2">
    <v-text-field
      label="Message.."
      prepend-icon="place"
      append-outer-icon="send"
      ref="input"
      v-model="inputData"
      :rules="[() => !!inputData || 'This field is required']"
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
      const inputRef = this.$refs['input']
      if (inputRef.validate()) {
        this.$emit('createMessage', this.inputData)
        inputRef.reset()
      }
    }
  }
}
</script>
