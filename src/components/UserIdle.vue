<template>
  <span />
</template>
<script>
const TIMEOUT = 30 * 1000 // 30 sec

export default {
  data() {
    return {
      isActive: true
    }
  },
  mounted() {
    this.touchUser()

    setInterval(() => {
      if (this.isActive) {
        // User still active - update `lastActionAt`
        this.touchUser()
      }
    }, TIMEOUT)
  },
  computed: {
    user() {
      return this.$store.getters['users/getAuthUser']
    }
  },
  methods: {
    touchUser() {
      this.$store.dispatch('users/apiTouchUser')
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
      this.touchUser()
    }
  }
}
</script>
