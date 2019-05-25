<template>
<div>
  

<body class="bg-gradient-primary">

  <div class="container">

    <!-- Outer Row -->
    <div class="row justify-content-center">

      <div class="col-md-7">

        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row justify-content-center text-center">
 
              <div class="col-lg-9">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Add User</h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input type="email" v-model="username" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter Email Address...">
                    </div>
                    <div class="form-group">
                      <select  class="custom-select">
                      <option value="" selected disabled>Please select</option>                        
                      <option value="Admin">Admin</option>
                      <option>Super Admin</option>
                      <option>Delivery</option>   
                      </select>
                    </div>
                
                    <a v-on:click="addUser" class="btn btn-primary btn-user btn-block">
                      <span>Add User</span>
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
  </div>
</template>
<script>
import { ADD_USER } from "@/store/actions/user";
import { required } from 'vuelidate/lib/validators';
export default {


  
  data() {
    return {
      selected : 1,
      username: "",
    
      options: [
          { value: '1', text: 'Admin' },
          { value: '2', text: 'Delivery' },
          { value: '3', text: 'Super Admin'},
      ],
  }
  },

 validations: {
   username: {
      required,
    },
    password: {
      required,
    }
    
  },

  methods: {
     message (method,messageText) {
    	let config = {
      	text: messageText,
        button: 'ok'
      }
      this.$snack[method](config)
  
    },  
  addUser(){
     const {username, password } = this;
     const formData = new FormData();
    formData.append('username', username);
  
console.log("username: "+username )
     this.$store
    .dispatch(ADD_USER, formData)
    .then(() => {
      
           this.message('success','You have added a new user!')
        })
        .catch(error => {
          console.dir(error)
          this.message('danger',error.response.data.message)
     //this.$router.replace({name:'SummaryOfOrders'});
  });
  }
    
  
  },

  mounted() {}
};
</script>

<style scoped>
body{
  height:100vh
  
}
.custom-select{
  border-radius: 10rem;
  height:3rem;
  font-size:0.8rem
}
span{
   color : white
}
</style>