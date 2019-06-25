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
          <!-- Main Content -->
          <div id="content">
            <div class="row mb-4">
              <b-container fluid>
                <b-row class="bg-white text-left" align-h="center">
                  <b-col cols="8" class="my-5">
                    <b-form class="resource-form">
                      <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                      <b-form-group label-cols-sm="3" label="User Name" label-for="input-horizontal">
                        <b-form-input v-model="this.username"></b-form-input>
                      </b-form-group>

                      <b-form-group label-cols-sm="3" label="Role" label-for="input-horizontal">
                        <select class="custom-select form-control">
                          <option value selected disabled>Please select</option>
                          <option value="Admin">Admin</option>
                          <option selected>Super Admin</option>
                          <option>Delivery</option>
                        </select>
                      </b-form-group>

                      <b-form-group
                        label-cols-sm="3"
                        label="Reset Password"
                        label-for="input-horizontal"
                      >
                        <b-button v-b-modal.resetPassword class="w-25" variant="danger">Reset</b-button>
                      </b-form-group>

                      <b-form-group
                        label-cols-sm="3"
                        label="Disable User"
                        label-for="input-horizontal"
                      >
                        <b-button v-b-modal.disableUser class="w-25" variant="danger">Disable</b-button>
                      </b-form-group>

                      <b-form-group
                        label-cols-sm="3"
                        label="Delete User"
                        label-for="input-horizontal"
                      >
                        <b-button v-b-modal.deleteUser class="w-25" variant="danger">Delete</b-button>
                      </b-form-group>

                      <b-form-group label-cols-sm="3" label-for="input-horizontal">
                        <b-button class="w-25" variant="primary">Save</b-button>
                        <b-button class="w-25" style="margin-left:2em " variant="secondary">Cancel</b-button>
                      </b-form-group>
                    </b-form>
                  </b-col>
                </b-row>
              </b-container>

              <b-modal @ok="handleok()" id="resetPassword" title="Reset Password">
                <p class="my-4">Are you sure you want to reset this user's password?</p>
                <p class="my-4">This action cannot be undone.</p>
              </b-modal>

              <b-modal id="disableUser" title="Disable User">
                <p class="my-4">You are about to disable this user's account</p>
              </b-modal>

              <b-modal id="deleteUser" title="Delete User">
                <p class="my-4">You are about to delete this account PERMANENTLY!</p>
                <p class="my-4">This action cannot be undone.</p>
              </b-modal>
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

  <!-- End of Content Wrapper -->
</template>

<script>
  import SideBar from "@/components/SideBar";
  import DashboardHeader from "@/components/DashboardHeader";

  export default {

    data(){
      return{
      username: "kidzania@hotmail.com"
      }
    },
    components: {
      SideBar,
      DashboardHeader
    },
    methods:{
      handleok(){
        console.log("hi")
      }
    }
  
};
</script>

<style>
</style>