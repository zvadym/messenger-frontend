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
        :rules="[
          () => title.length > 3 || 'at least 3 letters',
          () => title.length < 20 || 'max 20 letters',
          () =>
            /^[\w\d_]+$/.test(title) === true || '[a-z0-9] and _ are allowed'
        ]"
      ></v-text-field>
      <v-switch
        label="private chat"
        hint="only invited members can join"
        v-model="isPrivate"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn text :to="{ name: 'home' }">Cancel</v-btn>
      <v-btn
        text
        outlined
        color="primary"
        absolute
        right
        :disabled="disableSubmit"
        @click="createChannel"
        >Create</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      isPrivate: false,
      disableSubmit: true
    }
  },
  watch: {
    title: function() {
      this.disableSubmit = !this.$refs['titleRef'].validate()
    }
  },
  methods: {
    createChannel() {
      if (this.$refs['titleRef'].validate()) {
        this.$store
          .dispatch('chat/createChannel', {
            title: this.title,
            isPrivate: this.isPrivate
          })
          .then(channel => {
            this.$store
              .dispatch('chat/setActiveChannel', { id: channel.id })
              .then(() => {
                this.$router.push({
                  name: 'channel',
                  params: { id: channel.id }
                })
              })
          })
      }
    }
  }
}
</script>
