<template >
<body class="bg-gradient-primary">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <div class="row justify-content-center text-center">
              <div class="col-lg-9">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Welcome Back</h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        v-model="email"
                        type="email"
                        class="form-control form-control-user"
                        placeholder="Enter Email Address..."
                      />
                    </div>

                    <div class="form-group">
                      <input
                        v-model="password"
                        type="password"
                        class="form-control form-control-user"
                        placeholder="Password"
                      />
                    </div>

                    <b-row>
                   

                      <b-col>
                        <div>
                          <!-- <a v-on:click="validate" class="btn btn-primary btn-user btn-block">
                            <span>Login</span>
                          </a>-->
                          <b-button
                            type="submit"
                            @click.prevent="validate"
                            @keydown.enter.native.prevent="validate"
                            class="btn btn-primary btn-user btn-block"
                            variant="primary"
                          >Login</b-button>
                        </div>
                      </b-col>
                    </b-row>
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
import { SIGN_IN, USER_LOGOUT, BYPASSLOGIN } from "@/store/actions/user";

export default {
  data() {
    return {
      email: "",
      password: "",
      newPassword: "",
      newConfirmPassword: "",
      newPasswordNotSame: false,
      userid: null
    };
  },

  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
      // this.$snack[method](config)
    },

    //checks whether the email and password is correct or not.
    validate() {
      const { email, password } = this;

      const userStr = {
        email: email,
        password: password
      };

      this.$store
        .dispatch(SIGN_IN, userStr)
        .then(response => {
          if (!response.user.changePassword) {
            this.$router.replace({ name: "ChangePassword" });
          } else {
            this.message("success", "Logged in successfully!");
            if (this.$store.getters.userRole != "Delivery")
              this.$router.replace({ name: "SummaryOfOrders" });
            else this.$router.replace({ name: "Deliveries" });
          }
        })
        .catch(error => {
          this.$store.dispatch(USER_LOGOUT);
          console.log(error);
          this.message("danger", error.response.data.message);
        });

      // this.$store.dispatch(BYPASSLOGIN);
      // this.$router.replace({ name: "SummaryOfOrders" });
    }
  }
};
</script>

<style scoped>
body {
  height: 100vh;
}
</style>
