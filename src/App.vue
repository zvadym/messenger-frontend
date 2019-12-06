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
    firebase.auth().onAuthStateChanged(user => {
      this.$store.dispatch('users/setUser', user)
    })
  }
}
</script>
