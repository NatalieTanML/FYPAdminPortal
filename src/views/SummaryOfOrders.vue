<template>
  <div id="wrapper">
    <SideBar ></SideBar>
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

          <DashboardHeader title="Orders"></DashboardHeader>
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

        <div class="container-fluid">
          <!-- Main Content -->
          <div id="content">
            <div class="row mb-4">
              <ul class="nav" ref="tabs">
                <DashboardTabs
                  v-for="tab in this.Tabs"
                  v-bind:key="tab.id"
                  v-bind:title="tab.title"
                  v-bind:isDark="tab.isDark"
                  @click.native="onTabChange(tab.id)"
                ></DashboardTabs>
              </ul>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

        <div cols="4">
          <Table :key="this.forceRender" v-bind:fields="this.fields" v-bind:items="this.sortItems"></Table>
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
      forceRender : true,
      noOfTabs: 0,
      selectedTab: 0,
      typesOfTabs:["All","Ordered","Awaiting Print","Printed","Delivering","Completed","Cancelled"],
      Tabs: null,

      sortItems:[],

      items: [],
      fields: [
        { key: "refNo", label: "Ref. No", sortable: true },
        { key: "date", label: "Date", sortable: true },
        { key: "item", label: "Item", sortable: true },
        { key: "image", label: "Image" },
        { key: "quantity", label: "Qty", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "actions", label: "Actions" }
      ]
    };
  },

  computed:{

  },

  mounted(){
   const {typesOfTabs} = this 
      this.Tabs = [
        { title: typesOfTabs[0], id: 0, isDark: false },
        { title: typesOfTabs[1], id: 1, isDark: false },
        { title: typesOfTabs[2], id: 2, isDark: false },
        { title: typesOfTabs[3], id: 3, isDark: false },
        { title: typesOfTabs[4], id: 4, isDark: false },
        { title: typesOfTabs[5], id: 5, isDark: false }
      ],
    this.items = [
       {
          refNo: "123456",
          date: "22/04/19",
          item: "A5 Photo",
          image: "image",
          quantity: "2",
          status: "Awaiting Print",
          actions: "Print"
        },
        {
          refNo: "123457",
          date: "24/04/19",
          item: "Keychain",
          image: "image",
          quantity: "1",
          status: "Delivering",
          actions: "Completed"
        },
        {
          refNo: "123458",
          date: "25/04/19",
          item: "ID Card",
          image: "image",
          quantity: "2",
          status: "Delivering",
          actions: "Completed"
        },
        {
          refNo: "123459",
          date: "05/05/19",
          item: "A5 Photo + Frame",
          image: "image",
          quantity: "2",
          status: "Delivered",
          actions: "Archive"
        },
        {
          refNo: "123458",
          date: "28/04/19",
          item: "A5 Photo + Black Frame",
          image: "image",
          quantity: "1",
          status: "Printed",
          actions: "Deliver"
        },
        {
          refNo: "123459",
          date: "14/05/19",
          item: "Keychain (Black)",
          image: "image",
          quantity: "2",
          status: "Cancelled",
          actions: "Archive"
        },
         {
          refNo: "123460",
          date: "30/05/19",
          item: "Name Tag (Black)",
          image: "image",
          quantity: "1",
          status: "Cancelled",
          actions: "Archive"
        },
        {
          refNo: "123461",
          date: "30/05/19",
          item: "Name Tag (Red)",
          image: "image",
          quantity: "1",
          status: "Awaiting Print",
          actions: "Print"
        },
        {
          refNo: "123462",
          date: "13/05/19",
          item: "A4 Photo + Red Frame",
          image: "image",
          quantity: "3",
          status: "Ordered",
          actions: "Accept"
        },
        {
          refNo: "123463",
          date: "14/05/19",
          item: "Keychain",
          image: "image",
          quantity: "2",
          status: "Ordered",
          actions: "Accept"
        },
        {
          refNo: "123464",
          date: "23/04/19",
          item: "Keychain + A5 Photo",
          image: "image",
          quantity: "2",
          status: "Completed",
          actions: "Archive"
        },
         {
          refNo: "123465",
          date: "26/04/19",
          item: "A5 Photo",
          image: "image",
          quantity: "1",
          status: "Ordered",
          actions: "Accept"
        },
         {
          refNo: "123466",
          date: "16/04/19",
          item: "A3 Photo",
          image: "image",
          quantity: "2",
          status: "Delivering",
          actions: "Completed"
        },
    ]
    
    this.sortItems = this.items

    this.onTabChange(0);
  },

  methods: {
    onTabChange(id) {
      //const {sortItems, items, noOfTabs, Tabs, selectedTab, typesOfTabs} = this
      //reason why i don't use const ^ is because when the data is displayed,
      //it will become read-only.


      this.sortItems= []
      //change background color for the tab
       this.noOfTabs = this.$refs.tabs.childElementCount;

      if (! this.Tabs[id].isDark)  
      this.Tabs[id].isDark = true;

       this.selectedTab = id;
      var index;

      for (index = 0; index <  this.Tabs.length; index++) {
        if (id !=  this.Tabs[index].id)
          if ( this.Tabs[index].isDark)  
          this.Tabs[index].isDark = false;
      }
      //manipulate table data after changing tab color

      let sortBy =  this.typesOfTabs[id]

     
      for(index = 0; index <  this.items.length; index++)
      if( sortBy ===  this.items[index].status)
       this.sortItems.push( this.items[index])
      
      if(sortBy === "All")
      this.sortItems = this.items
     
     if(this.forceRender)
      this.forceRender = false;
      else
      this.forceRender = true

  

    }
  }
};
</script>

<style>
</style>