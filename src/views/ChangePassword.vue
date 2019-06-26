<template>
<body class="bg-gradient-primary">
     <i v-on:click="goBack()" class="fas fa-lg fa-arrow-left arrow"></i>

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
                        v-model="newPassword"
                        class="form-control form-control-user"
                        aria-describedby="emailHelp"
                        placeholder="Enter New Password..."
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        v-model="newConfirmPassword"
                        class="form-control form-control-user"
                        placeholder="Confirm Password..."
                      >
                    </div>

                    <a v-on:click="changePassword" class="btn btn-primary btn-user btn-block">
                      <span>Change Password</span>
                    </a>
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
import { GET_ONE_USER, CHANGEOWNPASSWORD,USER_LOGOUT } from "@/store/actions/user";
import store from "@/store";

export default {
  data() {
    return {
      newPassword: "",
      newConfirmPassword: "",
      newPasswordNotSame: false
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
    changePassword() {
      const { newPassword, newConfirmPassword } = this;

      if (newPassword != newConfirmPassword) this.newPasswordNotSame = true;
      else {
        this.newPasswordNotSame = false;

         const userStr = {
      "password" : newPassword
    };

        this.$store
          .dispatch(CHANGEOWNPASSWORD, userStr)
          .then(response => {
            this.message("success", "Your password has been updated!");
            this.$router.replace({ name: "Login" });
                      this.$store.dispatch(USER_LOGOUT);

          })
          .catch(error => {
            this.message("danger", error);
          });

      }
    },
    
    goBack(){
    let previousPathName = localStorage.getItem("previousPathName")
      console.log(previousPathName)
        if(store.getters.isAuthenticated && store.getters.changePassword)
        this.$router.replace({ name: previousPathName });
        else
        this.$router.replace({ name: "Login" });


    }
  },

  mounted() {

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
.arrow{
  margin-left: 2em;
  margin-top : 2em;
  cursor: pointer;
  color: white;
}

</style>

   