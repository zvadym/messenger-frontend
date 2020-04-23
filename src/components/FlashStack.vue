<template>
  <div id="alert-stack">
    <transition-group name="stack">
      <flash
        v-for="alert in alerts"
        :key="alert.nonce"
        :nonce="alert.nonce"
        :type="alert.level"
        :message="alert.message"
        :delay="3000"
        @remove="remove"
      />
    </transition-group>
  </div>
</template>

<script>
import bus from '@/bus'
import uniqId from '@/utils/unique-id'
import FlashMessage from '@/components/FlashMessage.vue'
export default {
  components: {
    flash: FlashMessage
  },
  data() {
    return {
      alerts: []
    }
  },
  created() {
    bus.$on('flash', (message, level) => {
      this.flash(message, level)
    })
  },
  methods: {
    flash(message, level = 'info') {
      this.alerts.push({
        message,
        level,
        show: true,
        nonce: uniqId()
      })
    },
    remove(nonce) {
      const index = this.alerts.findIndex(alert => alert.nonce === nonce)
      if (index !== -1) {
        this.alerts.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="css" rel="stylesheet/css" scoped>
.stack-enter-active,
.stack-leave-active {
  transition: all 1s;
}
.stack-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

#alert-stack {
  position: fixed;
  right: 0;
  bottom: 80px;
  left: 0;
  padding: 0 20px;
}
@media (min-width: 768px) {
  #alert-stack {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    left: auto;
  }
}
</style>
