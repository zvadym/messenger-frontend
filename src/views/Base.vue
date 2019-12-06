<template>
  <div>
    <Header />

    <v-content>
      <v-container fluid fill-height>
        <router-view />
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  components: {
    Header
  }
}
</script>
