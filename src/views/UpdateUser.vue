<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->

        <DashboardHeader title="Update User"></DashboardHeader>
        <!-- Topbar Navbar -->

        <!-- End of Topbar -->

        <!-- Begin Page Content -->

        <div class="container-fluid">
          <div class="card shadow mb-4">
            <!-- Main Content -->
            <div id="content">
              <div class="row my-4">
                <b-container fluid>
                  <b-row class="bg-white text-left" align-h="center" align-v="center">
                    <b-col lg="8" md="10" cols="11">
                      <b-form class="resource-form">
                        <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                        <b-form-group label-cols-sm="3" label="User Name">
                          <input
                            type="text"
                            v-model="name"
                            class="form-control form-control-user"
                            placeholder="Name"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.name.required"
                          >Name is required.</div>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label="Email">
                          <input
                            type="email"
                            v-model="email"
                            class="form-control form-control-user"
                            placeholder="Email address"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.email.required"
                          >Email is required.</div>
                          <div
                            class="error-message"
                            v-if="validate && !$v.email.email"
                          >Please enter a valid email address.</div>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label="Role">
                          <select
                            class="custom-select form-control"
                            name="role"
                            @change="onSelectChange($event)"
                          >
                            <option
                              v-for="role in roles"
                              v-bind:key="role.roleName"
                              :selected="role.roleName == selectedRole"
                              :value="role.roleId"
                            >{{ role.roleName}}</option>
                          </select>
                          <div
                            class="error-message"
                            v-if="validate && !$v.selectedRole.required"
                          >Please choose a role.</div>
                        </b-form-group>

                        <b-form-group
                          label-cols-sm="3"
                          label="Reset Password"
                          label-for="input-horizontal"
                        >
                          <b-button v-b-modal.resetPassword variant="danger">Reset</b-button>
                        </b-form-group>

                        <b-form-group
                          label-cols-sm="3"
                          label="Is Enabled"
                          label-for="input-horizontal"
                        >
                          <b-form-checkbox v-model="isEnabled" name="check-button" size="lg" switch></b-form-checkbox>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label-for="input-horizontal">
                          <b-button v-on:click="saveUser()" variant="primary">Save</b-button>
                          <b-button
                            v-on:click="cancelButton()"
                            class="ml-2"
                            variant="secondary"
                          >Cancel</b-button>
                        </b-form-group>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-container>

                <b-modal @ok="handleok()" id="resetPassword" title="Reset Password">
                  <p>Are you sure you want to reset this user's password?</p>
                  <p>This action cannot be undone.</p>
                </b-modal>

                <b-modal id="disableUser" title="Disable User">
                  <p>You are about to disable this user's account.</p>
                  <p>Click Ok to proceed.</p>
                </b-modal>
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

  <!-- End of Content Wrapper -->
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { required, email } from "vuelidate/lib/validators";

import {
  GET_ONE_USER,
  GET_ALL_ROLES,
  UPDATE_ONE_USER,
  RESETUSERPASSWORD
} from "@/store/actions/user";

export default {
  data() {
    return {
      userId: null,
      name: "",
      roleName: "",
      roles: null,
      selectedRole: null,
      validate: false,
      email: null,
      isEnabled: null,
      checked: null,
      updatedRole: null,
      userRoleId: null
    };
  },
  validations: {
    name: {
      required
    },
    selectedRole: {
      required
    },
    email: {
      required,
      email
    }
  },
  components: {
    SideBar,
    DashboardHeader,
    Footer
  },
  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    //get one user data
    getUserInformation() {
      let id = localStorage.getItem("updateUserId");

      this.$store
        .dispatch(GET_ONE_USER, id)
        .then(response => {
          console.log(response);
          this.name = response.name;
          this.selectedRole = response.roleName;
          this.email = response.email;
          this.isEnabled = response.isEnabled;
          this.userId = response.id;
          console.log(response);
          //i have to use updatedRole because for some reason, there is a bug in doing a v-model in select,
          //so i did a @onchange instead, which uses updatedRole
          this.updatedRole = response.roleId;
          this.validate = true;
          console.log(this.selectedRole);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
          //this.$router.replace({name:'SummaryOfOrders'});
        });
    },

    //get all roles to be displayed in the dropdown
    getRoles() {
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
    },
    onSelectChange(event) {
      this.updatedRole = event.target.value;
      console.log(this.updatedRole);
    },
    cancelButton() {
      this.$router.replace({ name: "UserManagement" });
    },
    saveUser() {
      if (this.name == "") this.name = null;

      if (this.email == "") this.email = null;

      if (
        this.name != null &&
        this.email != null &&
        this.$v.email.email &&
        this.selectedRole != null
      ) {
        console.log(this.updatedRole);
        let idInt = parseInt(this.updatedRole);

        const userStr = {
          inUser: {
            userId: this.userId,
            Email: this.email,
            Name: this.name,
            IsEnabled: this.isEnabled,
            RoleId: idInt
          },
          newPassword: null
        };
        console.log(userStr);
        this.$store
          .dispatch(UPDATE_ONE_USER, userStr)
          .then(response => {
            this.message("success", response.message);
          })
          .catch(error => {
            this.message("danger", error);
          });
      }
    },
    handleok() {
      this.$store
        .dispatch(RESETUSERPASSWORD, this.userId)
        .then(response => {
          this.message("success", response.message);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error.response.data.message);
          //this.$router.replace({name:'SummaryOfOrders'});
        });
    }
  },
  mounted() {
    this.getRoles();

    this.getUserInformation();
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