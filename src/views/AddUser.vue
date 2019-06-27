<template>
 <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
    
          <DashboardHeader title="Add User"></DashboardHeader>
          <!-- Topbar Navbar -->
    
        <!-- End of Topbar -->

        <!-- Begin Page Content -->

        <div class="container-fluid">
          <!-- Main Content -->
          <div id="content">
            <div class="row mb-4">
              <b-container fluid>
                <b-row class="bg-white text-left" align-h="center">
                  <b-col cols="8" class="my-5">
                    <b-form class="resource-form">
                      <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                      <b-form-group label-cols-sm="3" label="Email" label-for="input-horizontal">
                         <input type="email" v-model="user.email" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter Your Email Address...">
                      </b-form-group>

                      <b-form-group label-cols-sm="3" label="Name" label-for="input-horizontal">
                         <input type="text" v-model="user.username" class="form-control form-control-user" aria-describedby="" placeholder="Enter Your Name...">
                      </b-form-group>

                      <b-form-group label-cols-sm="3" label="Role" label-for="input-horizontal">
                       <select v-model="selectedRole" class="custom-select form-control">
                          <option value="" selected disabled>Please select</option>
                          <option v-for="role in this.roles" v-bind:key="role.roleId" :value="role.roleId" >
                            {{role.roleName}}
                          </option>
                        </select>
                      </b-form-group>


                      <b-form-group label-cols-sm="3" label-for="input-horizontal">
                        <b-button class="w-25"  v-on:click="addUser" variant="primary">Add User</b-button>
                      </b-form-group>

                    </b-form>
                  </b-col>
                </b-row>
              </b-container>
               </div>
          </div>
        </div>
        <!-- /.container-fluid -->


        <!-- End of Main Content -->
      </div>
      <!-- Footer -->
      <footer class="sticky-footer bg-white">
        <div class="container my-auto">
          <div class="copyright text-center my-auto">
            <span>Copyright &copy; Your Website 2019</span>
          </div>
        </div>
      </footer>
      <!-- End of Footer -->
    </div>
  </div>

                
                 
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import { ADD_USER, GET_ALL_ROLES } from "@/store/actions/user";
import { required } from "vuelidate/lib/validators";
export default {

  components:{
    SideBar,
    DashboardHeader
  },
  
  data() {
    return {
      roles:[],
      selectedRole: null,
      user:{
   
      email:"",
      username: "",
      },
      
    };
  },

  validations: {
    username: {
      required
    },
    password: {
      required
    },
     email: {
      required
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
    addUser() {
   
    const userStr = {
      "name" : this.user.username,
      "email" : this.user.email,
      "roleId" : this.selectedRole
    };
     

      this.$store
        .dispatch(ADD_USER, userStr)
        .then(() => {
          this.message("success", "You have added a new user!");
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error.response.data.message);
          //this.$router.replace({name:'SummaryOfOrders'});
        });
    }
  },

  mounted() {
      this.$store
      .dispatch(GET_ALL_ROLES)
      .then(response => {
        this.roles = response;
        console.log(this.roles)
      })
      .catch(error => {
          console.dir(error);
          this.message("danger", error.response.data.message);
          //this.$router.replace({name:'SummaryOfOrders'});
        });

  }
};
</script>

<style scoped>
</style>