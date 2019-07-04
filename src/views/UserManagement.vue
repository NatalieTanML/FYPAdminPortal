<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
     
          <DashboardHeader title="User Management"></DashboardHeader>
         
        <!-- End of Topbar -->

        <!-- Begin Page Content -->

        <!-- /.container-fluid -->

        <div cols="4">
          <Table
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:headerButtonClick="this.headerButtonClick"
            :headerButton="headerButton"
            v-bind:fields="this.fields"
            v-bind:items="this.items"
          ></Table>
        </div>
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
import Table from "@/components/Table";
import { eventBus } from "@/eventBus";
import { GET_ALL_USERS } from "@/store/actions/user";

export default {
  components: {
    SideBar,
    DashboardHeader,
    Table
  },
  data() {
    return {
      headerButtonClick: ["Add One User"],
      headerButton: [{id: 1, title: "Add User"}],
      actionButtonClick: "Edit One User",
      items: [],
      fields: [
        { key: "id", label: "", sortable: true },
        { key: "username", label: "Username", sortable: true },
        { key: "role", label: "Role", sortable: true },
        { key: "createdAt", label: "Created At" },
        { key: "createdBy", label: "Created By" },
        { key: "isEnabled", label: "Is Enabled" },
        { key: "actions", label: "Actions" }
      ]
    };
  },

  methods: {
     message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
      // this.$snack[method](config)
    },
  },
  mounted() {
    eventBus.$on(this.headerButtonClick[0], () => {
      this.$router.replace({ name: "AddUser" });
    });

    eventBus.$on(this.actionButtonClick,  (id) => {
      localStorage.setItem("updateUserId", id);
         this.$router.replace({ name: "UpdateUser" });
    });

      this.$store
          .dispatch(GET_ALL_USERS)
          .then(response => {
         console.log(response)
         this.items = response;
         let index;
         for(index = 0; index < this.items.length; index++){

         if(this.items[index].isEnabled)
         this.items[index].isEnabled = "Yes"
         else
         this.items[index].isEnabled = "No"

         this.items[index].actions = "Edit";
         }
          })
          .catch(error => {
  
            console.dir(error);
            this.message("danger", error);
          });
  }
};
</script>

<style>
</style>