<template>
  <span />
</template>

<script>
import bus from '@/bus'

const TIMEOUT = 30 * 1000 // 30 sec

export default {
  data() {
    return {
      isActive: true,
      lastActiveAt: Date.now()
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
    const timeDelta = Date.now() - this.lastActiveAt
    this.isActive = true
    this.lastActiveAt = Date.now()

    if (timeDelta > 60 * 1000) {
      bus.$emit(
        'flash',
        'Inactivity delta ' + parseInt(timeDelta / 1000) + ' sec',
        'warning'
      )
    }

    if (timeDelta > 30 * 60 * 1000) {
      console.warn('TODO: timeDelta > 30 min - reinit app')
    }

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
