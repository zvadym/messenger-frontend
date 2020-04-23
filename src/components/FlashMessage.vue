<template>
  <v-alert :type="type" border="top" dense dismissible>
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  props: {
    message: String,
    type: String,
    nonce: String,
    delay: Number
  },
  created() {
    if (this.delay > 0) {
      setTimeout(() => {
        this.dismiss()
      }, this.delay)
    }
  },
  methods: {
    dismiss() {
      this.$emit('remove', this.nonce)
    }
  }
}
</script>
