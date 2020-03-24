<template>
  <div>
    <v-navigation-drawer v-if="user" v-model="drawer" app clipped>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <UserAvatar :user="user" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.fullName }}</v-list-item-title>
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
      <RoomsList @closeMenu="closeMenu" />
    </v-navigation-drawer>

    <v-app-bar app absolute clipped-left>
      <v-app-bar-nav-icon v-if="user" @click.stop="drawer = !drawer" />
      <template v-if="activeRoom">
        <v-toolbar-title>#{{ activeRoom.title }} </v-toolbar-title>
        <v-btn
          icon
          absolute
          right
          :to="{ name: 'room-edit', params: { id: activeRoom.id } }"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import RoomsList from './RoomsList'
import UserAvatar from './UserAvatar'

export default {
  name: 'Header',
  components: { RoomsList, UserAvatar },
  data: () => ({
    drawer: null
  }),
  computed: {
    user() {
      return this.$store.getters['users/getAuthUser']
    },
    activeRoom() {
      return this.$store.getters['messenger/activeRoom']
    }
  },
  methods: {
    closeMenu() {
      this.drawer = false
    },
    signOut() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
