<template>
  <div id="app">
    <v-app>
      <router-view />
      <flash-stack />
    </v-app>
  </div>
</template>

<script>
import FlashStack from '@/components/FlashStack'

export default {
  components: {
    'flash-stack': FlashStack
  }
}
</script>
