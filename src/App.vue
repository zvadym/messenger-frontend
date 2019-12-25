<template>
  <div id="app">
    <v-app>
      <router-view />
    </v-app>
  </div>
</template>

<script>
import firebase from '@/services/firebase/index'

export default {
  created() {
    // Get auth user
    firebase.auth().onAuthStateChanged(user => {
      this.$store.dispatch('users/setAuthUser', user)
    })

    // Bind users to firebase
    this.$store.dispatch('users/firebaseBind')

    // Bind channels
    // TODO: bind only user's channels
    this.$store.dispatch('chat/firebaseChannelBind')
  }
}
</script>
