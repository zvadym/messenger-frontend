<template>
  <span />
</template>
<script>
const TIMEOUT = 3 * 60 * 60 * 1000 // 3 min

export default {
  data() {
    return {
      isActive: true
    }
  },
  mounted() {
    this.updateUserStatus()

    setInterval(() => {
      if (this.isActive) {
        // User still active - update `lastActionAt`
        this.updateUserStatus()
      }
    }, TIMEOUT)
  },
  computed: {
    user() {
      return this.$store.getters['users/getAuthUser']
    }
  },
  methods: {
    updateUserStatus() {
      this.$store.dispatch('users/updateActionAt')
    }
  },
  onIdle() {
    this.isActive = false
  },
  onActive() {
    this.isActive = true

    if (
      this.user &&
      (!this.user.lastActionAt ||
        Date.now() - this.user.lastActionAt.getTime() > TIMEOUT)
    ) {
      this.updateUserStatus()
    }
  }
}
</script>
