<template>
<body class="bg-gradient-primary">
  <div class="float-left">
    <i v-on:click="goBack()" class="fas fa-lg fa-arrow-left arrow"></i>
  </div>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <div class="row justify-content-center text-center">
              <div class="col-lg-9">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Change Password</h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        type="password"
                        v-model="oldPassword"
                        class="form-control form-control-user"
                        placeholder="Enter old password"
                      />
                      <div
                        class="error-message"
                        v-if="validate && !$v.oldPassword.required"
                      >This field is required</div>
                    </div>

                    <div class="form-group">
                      <input
                        type="password"
                        v-model="newPassword"
                        class="form-control form-control-user"
                        placeholder="Enter new password"
                      />
                      <div
                        class="error-message"
                        v-if="validate && !$v.newPassword.required"
                      >This field is required</div>
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        v-model="newConfirmPassword"
                        class="form-control form-control-user"
                        placeholder="Confirm new password"
                      />
                      <div
                        class="error-message"
                        v-if="validate && !$v.newConfirmPassword.required"
                      >This field is required.</div>
                      <div
                        class="error-message"
                        v-else-if="validate && !$v.newConfirmPassword.samePassword"
                      >New passwords must be identical</div>
                    </div>

                    <b-button
                      type="submit"
                      class="btn-user btn-block"
                      @click.prevent="changePassword"
                      @keydown.enter.native.prevent="validate"
                      variant="primary"
                    >Change Password</b-button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</template>
<script>
import {
  GET_ONE_USER,
  CHANGEOWNPASSWORD,
  USER_LOGOUT
} from "@/store/actions/user";
import store from "@/store";
import { sameAs, required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      newConfirmPassword: "",
      newPasswordNotSame: false,
      validate: false
    };
  },
  validations: {
    oldPassword: {
      required
    },

    newPassword: {
      required
    },

    newConfirmPassword: {
      required,
      samePassword: sameAs("newPassword")
    }
  },
  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    //calls the update user controller.
    changePassword() {
      //if validate is true, it will start validating the inputs
      this.validate = true;
      if (this.oldPassword == "") this.oldPassword = null;

      if (this.newPassword == "") this.newPassword = null;

      if (this.newConfirmPassword == "") this.newConfirmPassword = null;

      if (
        this.oldPassword != null &&
        this.newPassword != null &&
        this.$v.newConfirmPassword.samePassword
      ) {
        const { oldPassword, newPassword, newConfirmPassword } = this;

        if (newPassword != newConfirmPassword) {
        } else {
          this.newPasswordNotSame = false;
          const userStr = {
            inUser: {
              password: oldPassword
            },
            newPassword: newPassword
          };
          this.$store
            .dispatch(CHANGEOWNPASSWORD, userStr)
            .then(response => {
              this.message("success", "Your password has been updated!");
              this.$router.replace({ name: "Login" });
              this.$store.dispatch(USER_LOGOUT);
            })
            .catch(error => {
              this.message("danger", error.response.data.message);
            });
        }
      }
    },

    //let the user go back to the previous page(where he/she was from.)
    goBack() {
      let previousPathName = localStorage.getItem("previousPathName");
      if (store.getters.isAuthenticated && store.getters.changePassword)
        this.$router.replace({ name: previousPathName });
      else this.$router.replace({ name: "Login" });
    }
  },

  mounted() {}
};
</script>
<style scoped>
body {
  height: 100vh;
}
span {
  color: white;
}
.arrow {
  margin-left: 2em;
  margin-top: 2em;
  cursor: pointer;
  color: white;
}
.error-message {
  color: #dc3545;
  float: left;
  margin-left: 1em;
  margin-top: 0.2em;
  margin-bottom: 0.5em;
}
</style>

   