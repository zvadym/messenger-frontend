<template>
  <v-card
    v-if="!loading"
    class="mx-auto"
    min-width="300"
    max-width="500"
    outlined
  >
    <v-card-title>{{ viewTitle }}</v-card-title>
    <v-card-text>
      <v-text-field
        autofocus
        counter="20"
        label="Room title"
        validate-on-blur
        v-model="form.title"
        ref="titleRef"
        :rules="inputRules"
      ></v-text-field>
      <v-switch
        label="private room"
        hint="only invited members can join"
        v-model="form.isPrivate"
      />
      <v-autocomplete
        v-if="form.isPrivate"
        v-model="form.memberIds"
        :items="users"
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
  <Loading v-else />
</template>

<script>
import UserAvatar from '@/components/UserAvatar'
import Loading from '@/components/Loading'

export default {
  components: { UserAvatar, Loading },
  data() {
    return {
      initialRoomData: null,
      loading: false,
      form: {
        title: '',
        isPrivate: false,
        memberIds: []
      },
      viewTitle: 'Create room',
      disableSubmit: true,
      inputRules: [
        () => this.form.title.length >= 3 || 'at least 3 letters',
        () => this.form.title.length < 20 || 'max 20 letters',
        () =>
          /^[\w\d_\s]+$/.test(this.form.title) === true ||
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
      return this.initialRoomData === null ? 'Create' : 'Update'
    },
    cancelButtonRoute() {
      return this.initialRoomData === null
        ? { name: 'home' }
        : { name: 'room', params: { id: this.initialRoomData.id } }
    }
  },
  watch: {
    'form.title': function() {
      this.disableSubmit = !this.$refs['titleRef'].validate()
    }
  },
  mounted() {
    const cid = this.$route.params.id
    if (cid) {
      this.viewTitle = 'Update room data'

      this.initialRoomData = this.$store.getters['messenger/getRoomById'](cid)
      this.form.title = this.initialRoomData.title
      this.form.isPrivate = this.initialRoomData.isPrivate

      if (this.form.isPrivate) {
        this.form.memberIds = [...this.initialRoomData.memberIds]
      }
    }
  },
  methods: {
    submitData() {
      if (!this.$refs['titleRef'].validate()) {
        return false
      }
      if (this.initialRoomData === null) {
        return this.createRoom()
      }
      return this.updateRoom()
    },
    createRoom() {
      this.$store
        .dispatch('messenger/createRoom', {
          ...this.initialRoomData,
          ...this.form
        })
        .then(room => {
          // We have to wait till room will be added via socket__ action
          // And then redirect to this room
          this.loading = true

          let int = setInterval(() => {
            if (
              this.$store.getters['messenger/getRoomById'](room.id) !==
              undefined
            ) {
              clearInterval(int)
              this.$router.push({
                name: 'room',
                params: { id: room.id }
              })
            }
          }, 500)
        })
    },
    updateRoom() {
      this.$store
        .dispatch('messenger/saveRoomChanges', {
          ...this.initialRoomData,
          ...this.form
        })
        .then(room => {
          this.$router.push({
            name: 'room',
            params: { id: room.id }
          })
        })
    },
    removeUser(item) {
      const index = this.form.memberIds.indexOf(item.id)
      if (index >= 0) this.form.memberIds.splice(index, 1)
    },
    checkUniqTitle() {
      const room = this.$store.getters['messenger/getRoomByTitle'](
        this.form.title
      )

      if (!room) {
        return true
      }

      if (this.initialRoomData && this.initialRoomData.id === room.id) {
        return true
      }

      return 'This room name is already used'
    }
  }
}
</script>
