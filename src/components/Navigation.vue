<template></template>


<script>
export default {
  name: "Navigation",

  data() {
    return {
      //  hasLogin: this.$store.getters.isAuthenticated,
      // userRole : this.$store.getters.userRole
      hasLogin: false,
      userRole: null
    };
  },

  created() {
    //article on eventBus: https://medium.com/easyread/vue-as-event-bus-life-is-happier-7a04fe5231e1
    //  eventBus.$on('user-profile-loaded', () => {
    //      this.hasLogin = this.$store.getters.isAuthenticated;
    //       this.userRole = this.$store.getters.userRole;

    //});

    console.log("nav: created method ran.");
    this.hasLogin = true;
    if (this.hasLogin) {
      this.$router.push("/Login");
      console.log(this.$route);
      console.log("login pushed");
    }
  }
};
</script>
