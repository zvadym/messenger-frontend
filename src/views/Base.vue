<template>
  <v-app>
    <Header app />
    <UserIdle />

    <v-content id="root-content">
      <v-container fluid fill-height class="pa-0" grey lighten-3>
        <router-view v-if="loaded" />
        <div v-else class="text-center ma-12">
          <v-progress-circular size="50" indeterminate />
        </div>
      </v-container>
    </v-content>
    <flash-stack />
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import UserIdle from '@/components/UserIdle' // detect user actions
import FlashStack from '@/components/FlashStack'
import ApiService from '@/services/api/index'

export default {
  data() {
    return {
      loaded: false
    }
  },
  computed: {},
  components: {
    'flash-stack': FlashStack,
    Header,
    UserIdle
  },
  created() {
    if (!this.channelsLoaded) {
      ApiService.getRooms()
        .then(data => {
          data.forEach(item => {
            this.$store.dispatch('chat/addRoom', item)
          })
        })
        .then(() => {
          this.loaded = true
        })
    }
  }
}
</script>
