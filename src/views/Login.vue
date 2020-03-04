<template>
  <div>
    <form class="w-full max-w-sm mx-auto">
      <h1>Login</h1>
      <div class="md:flex md:items-baseline mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-grey font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-full-name"
          >
            Username
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            id="inline-full-name"
            v-model="credentials.email"
            class="bg-grey-lighter appearance-none border-2 border-grey-lighter focus:border-purple rounded w-full py-2 px-4 text-grey-darker"
            type="email"
          />
          <p v-if="hasValidationError('email')" class="text-red text-sm mt-1">
            {{ getValidationError('email') }}
          </p>
        </div>
      </div>
      <div class="md:flex md:items-baseline mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-grey font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-username"
          >
            Password
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            id="inline-username"
            v-model="credentials.password"
            class="bg-grey-lighter appearance-none border-2 border-grey-lighter focus:border-purple rounded w-full py-2 px-4 text-grey-darker"
            type="password"
            @keydown.enter.prevent="login"
          />
        </div>
      </div>
      <div class="md:flex md:items-baseline">
        <div class="md:w-1/3" />
        <div class="md:w-2/3">
          <button
            class="shadow bg-purple hover:bg-purple-light font-bold py-2 px-4 rounded"
            type="button"
            @click.prevent="login"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['hasValidationError', 'getValidationError'])
  },
  methods: {
    forgot() {
      this.$router.push({ name: 'ForgotPassword' })
    },
    login() {
      this.clearFormErrors()
      this.$store.dispatch('auth/login', this.credentials).catch(error => {
        console.log('Error:', error)
      })
    },
    resetForm() {
      this.credentials = {
        email: '',
        password: ''
      }
      this.clearFormErrors()
    },
    ...mapMutations('auth', ['clearFormErrors'])
  }
}
</script>
