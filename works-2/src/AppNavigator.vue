<template>
  <v-ons-navigator :page-stack="pageStack"></v-ons-navigator>
</template>

<script>
import Onboarder from '@/Onboarder'
// import Blah from '@/partials/Blah' // we handle this in main.js

export default {
  // components: { Blah },
  beforeCreate() {
    this.$store.commit('navigator/push', Onboarder)
  },
  computed: {
    pageStack() {
      return this.$store.state.navigator.stack
    },
  },
}
</script>
