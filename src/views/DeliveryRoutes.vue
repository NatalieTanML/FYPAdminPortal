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

          <!-- Topbar Navbar -->
          <DashboardHeader title="Delivery Routes"></DashboardHeader>

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
        <!-- Main Content -->
        <div id="content">
          <div>
            <Table
              headerButton="Assign Selected to Deliveryman"
              v-bind:headerButtonClick="this.headerButtonClick"
              v-bind:actionButtonClick="this.actionButtonClick"
              v-bind:fields="this.fields"
              v-bind:items="this.items"
            ></Table>
            <b-modal id="delivery-routes-modal" title="Assign to Deliveryman" ok-title="Save">
              <b-row align-v="center">
                <b-col cols="4">Deliveryman</b-col>
                <b-col>
                  <b-form-select v-model="selected" :options="options"></b-form-select>
                </b-col>
              </b-row>
            </b-modal>
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
      actionButtonClick: "Assign One to Deliveryman",
      headerButtonClick: "Assign Many to Deliveryman",
      items: [
        {
          refNo: "87654321",
          region: "Sentosa",
          postcode: "234567",
          deliveryman: "",
          actions: "Assign Deliveryman"
        },
        {
          refNo: "34567890",
          region: "East",
          postcode: "871234",
          deliveryman: "",
          actions: "Assign Deliveryman"
        },
        {
          refNo: "12345678",
          region: "Central",
          postcode: "321456",
          deliveryman: "ben@kidzania.sg",
          actions: "Change Deliveryman"
        },
        {
          refNo: "23456789",
          region: "Central",
          postcode: "321234",
          deliveryman: "ben@kidzania.sg",
          actions: "Change Deliveryman"
        }
      ],
      fields: [
        { key: "refNo", label: "Ref. No", sortable: true },
        { key: "region", label: "Region", sortable: true },
        { key: "postcode", label: "Postcode", sortable: true },
        { key: "deliveryman", label: "Deliveryman", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      selected: null,
      options: [
        { value: null, text: "Please select an option" },
        { value: "robert@kidzania.sg", text: "robert@kidzania.sg" },
        { value: "ben@kidzania.sg", text: "ben@kidzania.sg" }
      ]
    };
  },

  methods: {},
  mounted() {
    eventBus.$on(this.actionButtonClick, () => {
      console.log("Action button clicked");
      this.$bvModal.show("delivery-routes-modal");
    });
    eventBus.$on(this.headerButtonClick, () => {
      console.log("Header button clicked");
    });
  }
};
</script>

<style>
</style>