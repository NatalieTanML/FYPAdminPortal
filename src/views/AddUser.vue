<template>
 <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <DashboardHeader title="Add User"></DashboardHeader>
          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">
            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">Valerie Luna</span>
                <img class="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60">
              </a>
              <!-- Dropdown - User Information -->
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                  Activity Log
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
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
                      <b-form-group label-cols-sm="3" label="User Name" label-for="input-horizontal">
                         <input type="email" v-model="username" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter Email Address...">
                      </b-form-group>

                      <b-form-group label-cols-sm="3" label="Role" label-for="input-horizontal">
                       <select class="custom-select form-control">
                          <option value="" selected disabled>Please select</option>
                          <option value="Admin">Admin</option>
                          <option>Super Admin</option>
                          <option>Delivery</option>
                        </select>
                      </b-form-group>


          <b-form-group label-cols-sm="3" label="Password" label-for="input-horizontal">
                         <input type="password" v-model="username" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter Email Address...">
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
import { ADD_USER } from "@/store/actions/user";
import { required } from "vuelidate/lib/validators";
export default {

  components:{
    SideBar,
    DashboardHeader
  },
  
  data() {
    return {
      selected: 1,
      username: "",

      options: [
        { value: "1", text: "Admin" },
        { value: "2", text: "Delivery" },
        { value: "3", text: "Super Admin" }
      ]
    };
  },

  validations: {
    username: {
      required
    },
    password: {
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
      const { username, password } = this;
      const formData = new FormData();
      formData.append("username", username);

      console.log("username: " + username);
      this.$store
        .dispatch(ADD_USER, formData)
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

  mounted() {}
};
</script>

<style scoped>
</style>