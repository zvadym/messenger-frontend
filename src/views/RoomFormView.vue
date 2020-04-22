<template>
  <v-card class="mx-auto" min-width="300" max-width="500" outlined>
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-card-text>
      <v-text-field
        autofocus
        counter="20"
        label="Room name"
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
        v-model="members"
        :items="users"
        :loading="isUserLoading"
        chips
        clearable
        color="blue-grey lighten-2"
        item-text="name"
        item-value="id"
        label="Members..."
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
            {{ data.item.fullName }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <v-list-item-avatar>
            <UserAvatar :user="data.item" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.fullName"></v-list-item-title>
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
      editedRoomData: null,
      title: '',
      formTitle: 'Create room',
      isPrivate: false,
      members: [],
      disableSubmit: true,
      isUserLoading: false,
      inputRules: [
        () => this.title.length >= 3 || 'at least 3 letters',
        () => this.title.length < 20 || 'max 20 letters',
        () =>
          /^[\w\d_\s]+$/.test(this.title) === true ||
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
      return this.editedRoomData === null ? 'Create' : 'Edit'
    },
    cancelButtonRoute() {
      return this.editedRoomData === null
        ? { name: 'home' }
        : { name: 'room', params: { id: this.editedRoomData.id } }
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
      this.editedRoomData = this.$store.getters['messenger/getRoomById'](cid)
      this.title = this.editedRoomData.title
      this.formTitle = 'Update room data'
      this.isPrivate = this.editedRoomData.isPrivate
      if (this.isPrivate) {
        this.members = this.editedRoomData.memberIds.filter(
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
      if (this.editedRoomData === null) {
        return this.createRoom()
      }
      return this.editRoom()
    },
    createRoom() {
      this.$store
        .dispatch('messenger/createRoom', {
          title: this.title,
          isPrivate: this.isPrivate,
          members: this.members
        })
        .then(room => {
          this.$store
            .dispatch('messenger/setActiveRoom', { id: room.id })
            .then(() => {
              this.$router.push({
                name: 'room',
                params: { id: room.id }
              })
            })
        })
    },
    editRoom() {
      this.$store
        .dispatch('messenger/updateRoom', {
          data: {
            id: this.editedRoomData.id,
            title: this.title,
            isPrivate: this.isPrivate,
            members: this.members
          }
        })
        .then(() => {
          this.$router.push({
            name: 'room',
            params: { id: this.editedRoomData.id }
          })
        })
    },
    removeUser(item) {
      const index = this.members.indexOf(item.id)
      if (index >= 0) this.members.splice(index, 1)
    },
    checkUniqTitle() {
      const room = this.$store.getters['messenger/getRoomByTitle'](this.title)

      if (!room) {
        return true
      }

      if (this.editedRoomData && this.editedRoomData.id === room.id) {
        return true
      }

      return 'This room name is already used'
    }
  }
}
</script>
