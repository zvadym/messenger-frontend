<template>
  <li class="item d-flex justify-center">
    <div class="message purple lighten-2 elevation-3 white--text px-4 mx-auto">
      {{ data.message }}
    </div>
    <div class="clearfix"></div>
  </li>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>

<style lang="sass" scoped>
.item
  .message
    border-radius: 12px

  .clearfix
    clear: both
</style>
