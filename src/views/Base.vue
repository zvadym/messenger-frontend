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

export default {
  data() {
    return {
      channelsLoaded: false,
      usersLoaded: false
    }
  },
  computed: {
    loaded() {
      return this.channelsLoaded && this.usersLoaded
    }
  },
  components: {
    'flash-stack': FlashStack,
    Header,
    UserIdle
  }
}
</script>
