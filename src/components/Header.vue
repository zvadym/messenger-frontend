<template>
  <div>
    <v-navigation-drawer v-if="user" v-model="drawer" app clipped>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <UserAvatar :user="user" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ user.email }}
              <v-btn
                color="pink"
                dark
                x-small
                absolute
                bottom
                right
                fab
                @click="signOut"
              >
                <v-icon>logout</v-icon>
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider />
      <ChannelsList @closeMenu="closeMenu" />
    </v-navigation-drawer>

    <v-app-bar app absolute clipped-left>
      <v-app-bar-nav-icon
        v-if="user"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title v-if="activeChannel"
        >#{{ activeChannel.title }}
      </v-toolbar-title>
      <v-toolbar-title v-else>Odin chats</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from '@/services/firebase/index'
import ChannelsList from './ChannelsList'
import UserAvatar from './UserAvatar'

export default {
  name: 'Header',
  components: { ChannelsList, UserAvatar },
  data: () => ({
    drawer: null
  }),
  computed: {
    user() {
      return this.$store.getters['users/getAuthUser']
    },
    activeChannel() {
      return this.$store.getters['chat/activeChannel']
    }
  },
  methods: {
    closeMenu() {
      this.drawer = false
    },
    signOut() {
      firebase.auth().signOut()
      this.$store.dispatch('users/setUser', null)
    }
  }
}
</script>
