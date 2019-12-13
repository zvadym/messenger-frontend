<template>
  <v-app>
    <Header app />

    <v-content>
      <v-container fluid fill-height class="pa-0">
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header
  }
}
</script>
