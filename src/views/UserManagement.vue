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
            v-bind:isBusy="this.isBusy"
          ></Table>
        </div>
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
import Table from "@/components/Table";
import Footer from "@/components/Footer";
import { eventBus } from "@/eventBus";
import { GET_ALL_USERS } from "@/store/actions/user";

export default {
  components: {
    SideBar,
    DashboardHeader,
    Table,
    Footer
  },
  data() {
    return {
      headerButtonClick: ["Add User"],
      headerButton: [{ id: 1, title: "Add User" }],
      actionButtonClick: "Edit One User",
      items: [],
      fields: [
        { key: "id", label: "", sortable: true },
        { key: "name", label: "Username", sortable: true },
        { key: "role", label: "Role", sortable: true },
        { key: "createdAt", label: "Created At" },
        { key: "createdBy", label: "Created By" },
        { key: "isEnabled", label: "Is Enabled" },
        { key: "actions", label: "Actions" }
      ],
      isBusy: false
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

    this.isBusy = true;

    this.$store
      .dispatch(GET_ALL_USERS)
      .then(response => {
        this.isBusy = false;
        this.items = response;
        let index;
        for (index = 0; index < this.items.length; index++) {
          this.items[index].createdAt = new Date(
            Date.parse(this.items[index].createdAt)
          ).toLocaleString("en-SG");

          if (this.items[index].isEnabled) this.items[index].isEnabled = "Yes";
          else this.items[index].isEnabled = "No";

          this.items[index].actions = ["Edit"];
        }
      })
      .catch(error => {
        this.isBusy = false;
        console.dir(error);
        this.message("danger", error);
      });
  }
};
</script>

<style>
</style>