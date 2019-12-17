<template>
  <v-app>
    <Header app />
    <UserIdle />

    <v-content>
      <v-container fluid fill-height class="pa-0" grey lighten-3>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import UserIdle from '@/components/UserIdle'

export default {
  components: {
    Header,
    UserIdle
  }
}
</script>
