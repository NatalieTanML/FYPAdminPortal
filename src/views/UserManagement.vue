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
            headerButton="Add User"
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

export default {
  components: {
    SideBar,
    DashboardHeader,
    Table
  },
  data() {
    return {
      headerButtonClick: "Add One User",
      actionButtonClick: "Edit One User",
      items: [
        {
          id: "1",
          username: "kidzania@hotmail.com",
          role: "Super Admin",
          createdAt: "08/02/19 08:12",
          createdBy: "kidzania@hotmail.com",
          isEnabled: "Yes",
          actions: "Edit"
        },
        {
          id: "2",
          username: "superman@hotmail.com",
          role: "Admin",
          createdAt: "09/02/19 09:20",
          createdBy: "kidzania@hotmail.com",
          isEnabled: "Yes",
          actions: "Edit"
        },
        {
          id: "3",
          username: "deliveryman@hotmail.com",
          role: "Delivery",
          createdAt: "09/02/19 10:05",
          createdBy: "kidzania@hotmail.com",
          isEnabled: "Yes",
          actions: "Edit"
        },
        {
          id: "4",
          username: "deliveryman2@hotmail.com",
          role: "Delivery",
          createdAt: "10/02/19 12:16",
          createdBy: "kidzania@hotmail.com",
          isEnabled: "No",
          actions: "Edit"
        }
      ],
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

  methods: {},
  mounted() {
    eventBus.$on(this.headerButtonClick, () => {
      this.$router.replace({ name: "AddUser" });
    });

    eventBus.$on(this.actionButtonClick, () => {
      this.$router.replace({ name: "UpdateUser" });
    });
  }
};
</script>

<style>
</style>