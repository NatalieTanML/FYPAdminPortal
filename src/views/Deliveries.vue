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

          <DashboardHeader title="Deliveries"></DashboardHeader>
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
        <div cols="4">
          <Table v-bind:fields="this.fields" v-bind:items="this.items"></Table>
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
import DashboardTabs from "@/components/DashboardTabs";
import Table from "@/components/Table";

export default {
  components: {
    SideBar,
    DashboardHeader,
    DashboardTabs,
    Table
  },
  data() {
    return {
      noOfTabs: 0,
      selectedTab: 0,

      items: [
        {
          refNo: "123456",
          date: "22/04/19",
          item: "A5 Photo",
          hotel: "Resorts World Sentosa",
          actions: "Delivered"
        },
        {
          refNo: "123457",
          date: "24/04/19",
          item: "Keychain",
          hotel: "Siloso Beach Resort",
          actions: "Delivered"
        },
        {
          refNo: "123458",
          date: "25/04/19",
          item: "ID Card",
          hotel: "ONE°15 Marina Sentosa Cove",
          actions: "Delivered"
        },
        {
          refNo: "123459",
          date: "05/05/19",
          item: "A5 Photo + Frame",
          hotel: "Le Méridien Singapore",
          actions: "Delivered"
        }
      ],
      fields: [
        { key: "refNo", label: "Ref. No", sortable: true },
        { key: "date", label: "Date", sortable: true },
        { key: "item", label: "Item", sortable: true },
        { key: "hotel", label: "Hotel", sortable: true },
        { key: "actions", label: "Actions" }
      ]
    };
  },

  methods: {
    changeBackgroundColor(id) {
      this.noOfTabs = this.$refs.tabs.childElementCount;

      if (!this.Tabs[id].isDark) this.Tabs[id].isDark = true;

      this.selectedTab = id;
      var index;

      for (index = 0; index < this.Tabs.length; index++) {
        if (id != this.Tabs[index].id)
          if (this.Tabs[index].isDark) this.Tabs[index].isDark = false;
      }
    }
  }
};
</script>

<style>
</style>