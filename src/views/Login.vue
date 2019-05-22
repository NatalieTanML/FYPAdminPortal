<template>
   
<div>
   
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
<<<<<<< HEAD
                    <h1 class="h4 text-gray-900 mb-4">Welcome Back</h1>
=======
                    <h1 class="h4 text-gray-900 mb-4">Login</h1>
>>>>>>> 57e96555d3d2900e88e43862a07c176f36081d96
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input type="email" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address...">
                    </div>
                    <div class="form-group">
                      <input type="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password">
                    </div>
                    <div class="form-group">
                      <div class="custom-control custom-checkbox small">
                        <input type="checkbox" class="custom-control-input" id="customCheck">
                        <label class="custom-control-label" for="customCheck">Remember Me</label>
                      </div>
                    </div>
<<<<<<< HEAD
                    <router-link to="dashboard"><a class="btn btn-primary btn-user btn-block">
                     <span>Login</span>
                    </a>
                    </router-link>
                    <hr>
                    <a  class="btn btn-google btn-user btn-block">
                      <i class="fab fa-google fa-fw"></i> <span>Login with Google</span>
                    </a>
                    <a class="btn btn-facebook btn-user btn-block">
                      <i class="fab fa-facebook-f fa-fw"></i> <span>Login with Facebook</span>
=======
                    <a href="index.html" class="btn btn-primary btn-user btn-block">
                      Login
                    </a>
                    <hr>
                    <a href="index.html" class="btn btn-google btn-user btn-block">
                      <i class="fab fa-google fa-fw"></i> Login with Google
                    </a>
                    <a href="index.html" class="btn btn-facebook btn-user btn-block">
                      <i class="fab fa-facebook-f fa-fw"></i> Login with Facebook
>>>>>>> 57e96555d3d2900e88e43862a07c176f36081d96
                    </a>
                  </form>
                  <hr>
                  <div class="text-center">
                    <a class="small" href="forgot-password.html">Forgot Password?</a>
                  </div>
                  <div class="text-center">
                    <a class="small" href="register.html">Create an Account!</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
  </body>
  </div>
</template>

<script>
import { SIGN_IN, USER_LOGOUT } from "@/store/actions/user";

export default{

data(){
  return{
    email:"",
    password:"",
    newPassword: "",
    newConfirmPassword:"",
    newPasswordNotSame: false,
    userid: null,
  }
},

methods :{
    message (method,messageText) {
    	let config = {
      	text: messageText,
        button: 'ok'
      }
      this.$snack[method](config)
    	// this.$snack[method](config)
    },  
  validate()
  {
    const {email, password } = this;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    this.$store
    .dispatch(SIGN_IN, formData)
    .then((response) => {
     
            if(!response.user.changePassword){
            this.$router.replace({name:'ChangePassword'});
         
            }
            else
           this.message('success','You have logged in')

        })
        .catch(error => {
          console.dir(error)
          this.message('danger',error)
  });

},

logout(){

   this.$store
    .dispatch(USER_LOGOUT)
    .then(() => {
      
           this.message('success','You have signed out')

        })
        .catch(error => {
          console.dir(error)
          this.message('danger',error.response.data.message)

  });
},






}
} 

</script>

<style scoped >
body{
  height:100%
}
span{
  color : white
}
</style>
