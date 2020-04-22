<template>
  <form>
    <v-card class="mx-auto my-3" max-width="500" outlined>
      <v-card-title>Login</v-card-title>

      <v-form class="ma-3" v-model="valid" ref="form">
        <v-text-field
          v-model="credentials.email"
          :rules="[rules.required, rules.email]"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="credentials.password"
          :rules="[rules.required]"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          required
          @keydown.enter.prevent="login"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click.prevent="login"
        >
          Go
        </v-btn>
      </v-form>
    </v-card>
  </form>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      showPassword: false,
      credentials: {
        email: '',
        password: ''
      },
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      redirectTo: null
    }
  },
  methods: {
    login() {
      this.$refs.form.resetValidation()
      this.$store
        .dispatch('auth/login', {
          email: this.credentials.email,
          password: this.credentials.password
        })
        .then(() => {
          this.$router.push(this.redirectTo)
        })
        .catch(() => {
          this.$refs.form.reset()
        })
    }
  },
  mounted() {
    // Reset store
    this.$store.reset()

    // Attempt to login in background (read credentials from local storage)
    this.$store.dispatch('auth/tryAutoLogin').then(() => {
      if (this.$store.getters['auth/isAuthenticated']) {
        this.$router.push(this.redirectTo)
      }
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.redirectTo = to.query.redirect || from.path
    })
  }
}
</script>
