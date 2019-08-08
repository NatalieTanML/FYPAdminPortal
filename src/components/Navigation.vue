<template></template>


<script>
export default {
  name: "Navigation",

  data() {
    return {
      hasLogin: false,
      userRole: null
    };
  },

  created() {
    this.hasLogin = true;
    if (this.hasLogin) {
      // this.$router.push("/Login");
    }
  }
};
</script>
