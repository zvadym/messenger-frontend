<template>
  <v-app>
    <Header app />
    <UserIdle />

    <v-content id="root-content">
      <v-container fluid fill-height class="pa-0" grey lighten-3>
        <router-view v-if="loaded" />
        <Loading v-else />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import UserIdle from '@/components/UserIdle' // detect user actions
import Loading from '@/components/Loading'

export default {
  data() {
    return {
      roomsLoaded: false,
      usersLoaded: false
    }
  },
  computed: {
    loaded() {
      return this.roomsLoaded && this.usersLoaded
    }
  },
  components: {
    Header,
    UserIdle,
    Loading
  },
  created() {
    if (!this.roomsLoaded) {
      this.$store.dispatch('messenger/loadRooms').then(() => {
        this.roomsLoaded = true
      })
    }
    if (!this.usersLoaded) {
      this.$store.dispatch('users/apiGetUsers').then(() => {
        this.usersLoaded = true
      })
    }
  }
}
</script>
