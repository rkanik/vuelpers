<template>
   <div class="Vuex">
      <h4>This is Vuex component</h4>
      <v-btn @click="$store.dispatch('initialize', { message: 'Hello' })">Trigger</v-btn>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
   name: 'Vuex',
})
</script>

<style lang="scss" scoped>
.Vuex {}
</style>
