<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <span class="display-2">Douhau Data Studio</span>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <!-- <HelloWorld/> -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
  }),
});
</script>
