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

          <DashboardHeader title="User Management"></DashboardHeader>
          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">
            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">Valerie Luna</span>
                <img
                  class="img-profile rounded-circle"
                  src="https://source.unsplash.com/QAB-WJcbgJk/60x60"
                >
              </a>
              <!-- Dropdown - User Information -->
              <div
                class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown"
              >
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

        <!-- /.container-fluid -->

        <div cols="4">
          <Table v-bind:actionButtonClick="this.actionButtonClick" v-bind:headerButtonClick="this.headerButtonClick" headerButton="Add User" v-bind:fields="this.fields" v-bind:items="this.items"></Table>
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

  methods: {

  },
  created(){
 eventBus.$on(this.headerButtonClick, () => {
 this.$router.replace({name:'AddUser'});
  })

  eventBus.$on(this.actionButtonClick, () => {
 this.$router.replace({name:'UpdateUser'});

  })
}
}

</script>

<style>
</style>