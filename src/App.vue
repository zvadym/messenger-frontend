<template>
  <div id="app">
    <v-app>
      <router-view />
    </v-app>
  </div>
</template>

<script>
export default {
  created() {
    // Get auth user
    // firebase.auth().onAuthStateChanged(user => {
    //   this.$store.dispatch('users/setAuthUser', user)
    // })
    // // Bind users to firebase
    // this.$store.dispatch('users/firebaseBind').then(() => {
    //   this.usersLoaded = true
    // })
    // // Bind channels
    // this.$store.dispatch('chat/firebaseChannelBind').then(() => {
    //   // Bind messages for each channel
    //   let res = []
    //   this.$store.state.chat.channels.forEach(channel => {
    //     res.push(this.$store.dispatch('chat/firebaseMessageBind', { channel }))
    //   })
    //   // Wait for channels data
    //   Promise.all(res).then(() => {
    //     this.channelsLoaded = true
    //   })
    // })
  }
}
</script>
