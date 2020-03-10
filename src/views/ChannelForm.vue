<template>
  <v-card class="mx-auto" min-width="300" max-width="500" outlined>
    <v-card-title>Create channel</v-card-title>
    <v-card-text>
      <v-text-field
        autofocus
        counter="20"
        label="Channel name"
        validate-on-blur
        v-model="title"
        ref="titleRef"
        :rules="inputRules"
      ></v-text-field>
      <v-switch
        label="private room"
        hint="only invited members can join"
        v-model="isPrivate"
      />
      <v-autocomplete
        v-if="isPrivate"
        v-model="invitedUsers"
        :items="users"
        :loading="isUserLoading"
        chips
        clearable
        color="blue-grey lighten-2"
        item-text="name"
        item-value="id"
        label="Invited users..."
        multiple
      >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="removeUser(data.item)"
          >
            <v-avatar left>
              <UserAvatar :user="data.item" />
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <v-list-item-avatar>
            <UserAvatar :user="data.item" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.name"></v-list-item-title>
            <v-list-item-subtitle
              v-html="data.item.email"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>
    </v-card-text>
    <v-card-actions>
      <v-btn text :to="cancelButtonRoute">Cancel</v-btn>
      <v-btn
        text
        outlined
        color="primary"
        absolute
        right
        :disabled="disableSubmit"
        @click="submitData"
        v-text="submitButtonLabel"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import UserAvatar from '@/components/UserAvatar'

export default {
  components: { UserAvatar },
  data() {
    return {
      editedChannelData: null,
      title: '',
      isPrivate: false,
      invitedUsers: [],
      disableSubmit: true,
      isUserLoading: false,
      inputRules: [
        () => this.title.length >= 3 || 'at least 3 letters',
        () => this.title.length < 20 || 'max 20 letters',
        () =>
          /^[\w\d_]+$/.test(this.title) === true ||
          '[a-z0-9] and _ are allowed',
        this.checkUniqTitle
      ]
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['users/getAuthUser']
    },
    users() {
      return this.$store.state.users.users.filter(
        u => u.id !== this.currentUser.id
      )
    },
    submitButtonLabel() {
      return this.editedChannelData === null ? 'Create' : 'Edit'
    },
    cancelButtonRoute() {
      return this.editedChannelData === null
        ? { name: 'home' }
        : { name: 'channel', params: { id: this.editedChannelData.id } }
    }
  },
  watch: {
    title: function() {
      // TODO: Refactor it (do not call `validate` so often)
      this.disableSubmit = !this.$refs['titleRef'].validate()
    }
  },
  mounted() {
    const cid = this.$route.params.id
    if (cid) {
      this.editedChannelData = this.$store.getters['messenger/getById'](cid)
      this.title = this.editedChannelData.title
      this.isPrivate = this.editedChannelData.isPrivate
      if (this.isPrivate) {
        this.invitedUsers = this.editedChannelData.memberIds.filter(
          uid => uid !== this.currentUser.id
        )
      }
    }
  },
  methods: {
    submitData() {
      if (!this.$refs['titleRef'].validate()) {
        return false
      }
      if (this.editedChannelData === null) {
        return this.createChannel()
      }
      return this.editChannel()
    },
    createChannel() {
      this.$store
        .dispatch('messenger/createChannel', {
          title: this.title,
          isPrivate: this.isPrivate,
          invitedUsers: this.invitedUsers
        })
        .then(channel => {
          this.$store
            .dispatch('messenger/setActiveChannel', { id: channel.id })
            .then(() => {
              this.$router.push({
                name: 'channel',
                params: { id: channel.id }
              })
            })
        })
    },
    editChannel() {
      this.$store
        .dispatch('messenger/updateChannel', {
          id: this.editedChannelData.id,
          title: this.title,
          isPrivate: this.isPrivate,
          invitedUsers: this.invitedUsers
        })
        .then(() => {
          this.$router.push({
            name: 'channel',
            params: { id: this.editedChannelData.id }
          })
        })
    },
    removeUser(item) {
      const index = this.invitedUsers.indexOf(item.id)
      if (index >= 0) this.invitedUsers.splice(index, 1)
    },
    checkUniqTitle() {
      const channel = this.$store.getters['users/getByName'](this.title)

      if (!channel) {
        return true
      }

      if (this.editedChannelData && this.editedChannelData.id === channel.id) {
        return true
      }

      return 'This channel name is already used'
    }
  }
}
</script>
