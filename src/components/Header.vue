<template>
  <div>
    <v-navigation-drawer v-if="user" v-model="drawer" app clipped>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img :src="user.avatar" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" @click="click">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <div class="pa-2">
        <v-btn block @click="signOut">Logout</v-btn>
      </div>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Odin Vue</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from '@/services/firebase/index'

export default {
  name: 'Header',
  data: () => ({
    drawer: null,
    items: [
      { title: 'Test 1', icon: 'mdi-home-city' },
      { title: 'Test 2', icon: 'mdi-account' },
      { title: 'Test 3', icon: 'mdi-account-group-outline' }
    ]
  }),
  computed: {
    user() {
      return this.$store.getters['users/authUser']
    }
  },
  methods: {
    click() {
      console.log('link clicked')
    },
    signOut() {
      firebase.auth().signOut()
      this.$store.dispatch('users/setUser', null)
    }
  }
}
</script>
