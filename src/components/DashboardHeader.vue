<template>
  <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    <b-button
      id="sidebarToggleTop"
      variant="link"
      class="btn btn-link d-md-none rounded-circle mr-3"
      v-b-toggle.nav-collapse
    >
      <i class="fa fa-bars"></i>
    </b-button>

    <div class="align-middle">
      <h4>{{title}}</h4>
    </div>

    <div class="ml-auto">
      <b-dropdown
        id="dropdown-header"
        variant="transparent"
        :text="this.name"
        no-caret
        class="mb-1 mydropdown"
      >
        <b-dropdown-header id="dropdown-header-label">Account</b-dropdown-header>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item-button
          v-on:click="resetPassword()"
          aria-describedby="dropdown-header-label"
        >Reset Password</b-dropdown-item-button>
        <b-dropdown-item-button
          v-on:click="logout()"
          aria-describedby="dropdown-header-label"
        >Sign Out</b-dropdown-item-button>
      </b-dropdown>
    </div>
  </nav>
</template>

<script>
import { USER_LOGOUT } from "@/store/actions/user";

export default {
  name: "DashboardHeader",
  props: {
    title: String
  },
  data() {
    return {
      name: " hi"
    };
  },
  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },
    logout() {
      this.$store
        .dispatch(USER_LOGOUT)
        .then(response => {
          this.message("success", "You have logged out!");
          this.$router.replace({ name: "Login" });
        })
        .catch(error => {
          this.message("danger", error);
        });
    },
    resetPassword() {
      this.$router.replace({ name: "ChangePassword" });
    }
  },
  mounted() {
    this.name = this.$store.getters.userName;

    if (this.$store.getters.userName == null) this.name = "No Name";
  }
};
</script>

<style scoped>
</style>
