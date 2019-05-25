 <template>
 
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
                    <h1 class="h4 text-gray-900 mb-4">Change Password</h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input type="password" v-model="newPassword" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter New Password...">
                    </div>
                    <div class="form-group">
                      <input type="password" v-model="newConfirmPassword" class="form-control form-control-user" placeholder="Confirm Password...">
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
import { GET_ONE_USER, UPDATE_ONE_USER } from "@/store/actions/user";


export default {
     data() {
       return {
            username:"",
            newPassword: "",
            newConfirmPassword:"",
            newPasswordNotSame: false,

       }
    },
    methods:{
        message (method,messageText) {
    	let config = {
      	text: messageText,
        button: 'ok'
      }
      this.$snack[method](config)
    },
       changePassword(){
            
         const {newPassword, newConfirmPassword} = this;

         if(newPassword != newConfirmPassword)
         this.newPasswordNotSame = true;

         else{
           this.newPasswordNotSame = false;

           let formData = new FormData();
           formData.append('password', newPassword);
           formData.append('username',this.username);

           this.$store
           .dispatch(UPDATE_ONE_USER, formData)
           .then((response) =>{
            this.message('success',"Your password has been updated!")
              this.$router.replace({ name: "Login" });
            })
            .catch(error =>{
          this.message('danger',error)

            });
            }
       
       },
       getUserInformation(){


          this.$store
          .dispatch(GET_ONE_USER)
          .then((response) => {

         this.username = response.username;

        })
        .catch(error => {
          console.dir(error)
          this.message('danger',error)
     //this.$router.replace({name:'SummaryOfOrders'});
      });
          
       }
    },

    mounted(){
       this.getUserInformation();
    }
 }

</script>
<style scoped>


body{
  height:100vh
}
span{
  color : white
}
</style>

   