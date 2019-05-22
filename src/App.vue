<template>
  <div>
    <Navigation/>
    <router-view/>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";

export default {
  name: "app",
  components: {
    Navigation
  }
};
</script>

<style>
</style>
