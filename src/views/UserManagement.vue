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
          :key="this.forceRender"
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
      headerButtonClick: ["Add User"],
      headerButton: [{ id: 1, title: "Add User" }],
      actionButtonClick: "Edit One User",
      forceRender: false,
      items: [],
      fields: [
        { key: "id", label: "", sortable: true },
        { key: "name", label: "Username", sortable: true },
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
    }
  },
  mounted() {
    eventBus.$on(this.headerButtonClick[0], () => {
      this.$router.replace({ name: "AddUser" });
    });

    eventBus.$on(this.actionButtonClick, id => {
      localStorage.setItem("updateUserId", id);
      this.$router.replace({ name: "UpdateUser" });
    });

    this.$store
      .dispatch(GET_ALL_USERS)
      .then(response => {
        console.log(response);
        this.items = response;
        let index;
        for (index = 0; index < this.items.length; index++) {
          
          this.items[index].createdAt = new Date(
                Date.parse(this.items[index].createdAt)
              ).toLocaleString()

          if (this.items[index].isEnabled) this.items[index].isEnabled = "Yes";
          else this.items[index].isEnabled = "No";

          this.items[index].actions = ["Edit"];
        }

        if (this.forceRender) this.forceRender = false;
        else this.forceRender = true;
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