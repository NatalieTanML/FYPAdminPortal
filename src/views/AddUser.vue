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
          <div class="card shadow mb-4">
            <!-- Main Content -->
            <div id="content">
              <div class="row mb-4">
                <b-container fluid>
                  <b-row class="bg-white text-left" align-h="center">
                    <b-col cols="8" class="my-5">
                      <b-form class="resource-form">
                        <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                        <b-form-group label-cols-sm="3" label="Name" label-for="input-horizontal">
                          <input
                            type="text"
                            v-model="user.username"
                            class="form-control form-control-user"
                            aria-describedby
                            placeholder="Name"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.user.username.required"
                          >Name is required!</div>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label="Email" label-for="input-horizontal">
                          <input
                            type="email"
                            v-model="user.email"
                            class="form-control form-control-user"
                            aria-describedby="emailHelp"
                            placeholder="Email address"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.user.email.required"
                          >Email is required!</div>
                          <div
                            class="error-message"
                            v-if="validate && !$v.user.email.email"
                          >Please enter a valid email!</div>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label="Role" label-for="input-horizontal">
                          <select v-model="selectedRole" class="custom-select form-control">
                            <option value selected disabled>Please select</option>
                            <option
                              v-for="role in this.roles"
                              v-bind:key="role.roleId"
                              :value="role.roleId"
                            >{{role.roleName}}</option>
                          </select>
                          <div
                            class="error-message"
                            v-if="validate && !$v.selectedRole.required"
                          >Please pick a role!</div>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label-for="input-horizontal">
                          <b-button class="w-25" v-on:click="addUser" variant="primary">Add User</b-button>
                        </b-form-group>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

        <!-- End of Main Content -->
      </div>
      <!-- Footer -->
      <Footer></Footer>
      <!-- End of Footer -->
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ADD_USER, GET_ALL_ROLES } from "@/store/actions/user";
import { required, email } from "vuelidate/lib/validators";
export default {
  components: {
    SideBar,
    DashboardHeader,
    Footer
  },

  data() {
    return {
      roles: [],
      validate: false,
      selectedRole: null,
      user: {
        email: "",
        username: ""
      }
    };
  },

  validations: {
    selectedRole: {
      required
    },
    user: {
      username: {
        required
      },

      email: {
        required,
        email
      }
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
      this.validate = true;
      if (this.user.username == "") this.user.username = null;

      if (this.user.email == "") this.user.email = null;

      if (
        this.user.username != null &&
        this.user.email != null &&
        this.$v.user.email.email &&
        this.selectedRole != null
      ) {
        const userStr = {
          name: this.user.username,
          email: this.user.email,
          roleId: this.selectedRole
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
    }
  },

  mounted() {
    this.$store
      .dispatch(GET_ALL_ROLES)
      .then(response => {
        this.roles = response;
        console.log(this.roles);
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
.error-message {
  color: #dc3545;
  display: inline-block;
  margin-top: 0.5em;
  margin-left: 0.5em;
}
</style>