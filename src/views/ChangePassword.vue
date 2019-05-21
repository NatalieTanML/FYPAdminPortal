 <template>

    <form>
    <div class="d-block text-center">
      <h3 >Please enter a new Password</h3>
      <p></p>
      <p>Username: {{this.username}}</p>
      
      <p class="">New Password:</p>
      <b-row class="w-150">
      <b-col></b-col>
      <b-col><input type="password" class="form-control" v-model="newPassword" required></b-col>
      <b-col></b-col>
      </b-row>
      <p></p>
      <p class="">Confirm Password:</p>
      <b-row class="w-150">
      <b-col></b-col>
      <b-col><input type="password" class="form-control" v-model="newConfirmPassword" required></b-col>
      <b-col></b-col>
      </b-row>
      <p></p>
      <p v-if="newPasswordNotSame">Please ensure that the password are the same!</p>
      <b-button align-v="end"   @click="changePassword">Confirm</b-button>

    
    </div>
    </form>

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


   