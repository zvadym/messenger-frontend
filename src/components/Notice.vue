<template>
  <li class="item mx-0 my-3">
    <div class="message body-2 primary white--text">
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

<style></style>
