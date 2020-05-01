<template>
  <v-app>
    <Header app />
    <UserIdle />

    <v-content id="root-content">
      <v-container fluid fill-height class="pa-0" grey lighten-3>
        <router-view v-if="socketIsConnected && dataLoaded" />
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
  components: {
    Header,
    UserIdle,
    Loading
  },
  data() {
    return {
      roomsLoaded: false,
      usersLoaded: false
    }
  },
  computed: {
    dataLoaded() {
      return this.roomsLoaded && this.usersLoaded
    },
    socketIsConnected() {
      return this.$store.state.socket.isConnected
    }
  },
  watch: {
    socketIsConnected: function(val) {
      // In case View was loaded earlier then socket was connected
      if (!this.dataLoaded && val) {
        this.init()
      }
    }
  },
  methods: {
    init() {
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
  },
  created() {
    if (this.socketIsConnected) {
      // Load data only after socket connection
      this.init()
    }
  }
}
</script>
