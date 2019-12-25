<template>
  <v-row align="center" justify="center">
    <v-col cols="10" sm="8" md="4">
      <div class="text-h6" justify="center">
        Sign in
      </div>
      <section id="firebaseui-auth-container"></section>
    </v-col>
  </v-row>
</template>

<script>
import firebase from '@/services/firebase/index'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth())
    }
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          this.$router.push({ name: 'home' })
        }
      }
    })
  }
}
</script>
