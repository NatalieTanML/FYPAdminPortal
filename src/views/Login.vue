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
                      >
                    </div>

                    <div class="form-group">
                      <input
                        v-model="password"
                        type="password"
                        class="form-control form-control-user"
                        placeholder="Password"
                      >
                    </div>

                    <b-row>
                      <b-col cols="12">
                        <div class="form-group float-left">
                          <div class="custom-control custom-checkbox small">
                            <input type="checkbox" class="custom-control-input" id="customCheck">
                            <label class="custom-control-label" for="customCheck">Remember Me</label>
                          </div>
                        </div>
                      </b-col>

                      <b-col>
                        <div>
                          <a v-on:click="validate" class="btn btn-primary btn-user btn-block">
                            <span>Login</span>
                          </a>
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
import { SIGN_IN, USER_LOGOUT,BYPASSLOGIN } from "@/store/actions/user";

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
    validate() {
      const { email, password } = this;

     const userStr = {

      "email" : email,
      "password" : password
    };
     

        this.$store
          .dispatch(SIGN_IN, userStr)
          .then(response => {
            if (!response.user.changePassword) {
              this.$router.replace({ name: "ChangePassword" });
            } else {
              this.message("success", "You have logged in");
              this.$router.replace({ name: "SummaryOfOrders" });
            }
          })
          .catch(error => {
            this.$store
          .dispatch(USER_LOGOUT)
            console.dir(error);
            this.message("danger", error);
          });

        // this.$store.dispatch(BYPASSLOGIN)
        // this.$router.replace({ name: "SummaryOfOrders" });


    },
    
    

  
  }
};
</script>

<style scoped>
body {
  height: 100vh;
}
span {
  color: white;
}

</style>
