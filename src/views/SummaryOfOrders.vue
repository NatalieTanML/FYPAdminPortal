<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
          
          <DashboardHeader title="Orders"></DashboardHeader>
          <!-- Topbar Navbar -->
         
        
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
                  v-bind:noOfRows="arrayOfNumberOfRows[tab.id]"
                  @click.native="onTabChange(tab.id)"
                ></DashboardTabs>
              </ul>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

        <div cols="4">
          <Table :key="this.forceRender" 
            v-bind:fields="this.fields" 
            v-bind:items="this.sortItems"
            v-bind:headerButtonClick="this.headerButtonClick"
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:enableCheckbox="this.enableCheckbox"
            headerButton="Update Order Status"
          >
          
          </Table>
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
import { eventBus } from "@/eventBus";

export default {
  components: {
    SideBar,
    DashboardHeader,
    DashboardTabs,
    Table
  },
  data() {
    return {
      headerButtonClick: "Check All Orders",
       actionButtonClick: "Edit One Order",
      forceRender: true,
      noOfTabs: 0,
      enableCheckbox: true,
      selectedTab: 0,
      arrayOfNumberOfRows: [],
      typesOfTabs: [
        "All",
        "Ordered",
        "Awaiting Print",
        "Printed",
        "Delivering",
        "Completed",
        "Cancelled"
      ],
      Tabs: null,

      sortItems: [],

      items: [],
      fields: [
        { key: "checkbox", label: "" },
        { key: "id", label: "Ref. No", sortable: true },
        { key: "date", label: "Date", sortable: true },
        { key: "item", label: "Item", sortable: true },
        { key: "image", label: "Image" },
        { key: "quantity", label: "Qty", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "actions", label: "Actions" }
      ]
    };
  },

  computed: {},

  mounted() {
    const { typesOfTabs } = this;
    (this.Tabs = [
      { title: typesOfTabs[0], id: 0, isDark: false },
      { title: typesOfTabs[1], id: 1, isDark: false },
      { title: typesOfTabs[2], id: 2, isDark: false },
      { title: typesOfTabs[3], id: 3, isDark: false },
      { title: typesOfTabs[4], id: 4, isDark: false },
      { title: typesOfTabs[5], id: 5, isDark: false }
    ]),
      (this.items = [
        {
          id: "123456",
          date: "22/04/19",
          item: "A5 Photo",
          image: "image",
          quantity: "2",
          status: "Awaiting Print",
          actions: "Print"
        },
        {
          id: "123457",
          date: "24/04/19",
          item: "Keychain",
          image: "image",
          quantity: "1",
          status: "Delivering",
          actions: "Completed"
        },
        {
          id: "123458",
          date: "25/04/19",
          item: "ID Card",
          image: "image",
          quantity: "2",
          status: "Delivering",
          actions: "Completed"
        },
        {
          id: "123459",
          date: "05/05/19",
          item: "A5 Photo + Frame",
          image: "image",
          quantity: "2",
          status: "Delivered",
          actions: "Archive"
        },
        {
          id: "123458",
          date: "28/04/19",
          item: "A5 Photo + Black Frame",
          image: "image",
          quantity: "1",
          status: "Printed",
          actions: "Deliver"
        },
        {
          id: "123459",
          date: "14/05/19",
          item: "Keychain (Black)",
          image: "image",
          quantity: "2",
          status: "Cancelled",
          actions: "Archive"
        },
        {
          id: "123460",
          date: "30/05/19",
          item: "Name Tag (Black)",
          image: "image",
          quantity: "1",
          status: "Cancelled",
          actions: "Archive"
        },
        {
          id: "123461",
          date: "30/05/19",
          item: "Name Tag (Red)",
          image: "image",
          quantity: "1",
          status: "Awaiting Print",
          actions: "Print"
        },
        {
          id: "123462",
          date: "13/05/19",
          item: "A4 Photo + Red Frame",
          image: "image",
          quantity: "3",
          status: "Ordered",
          actions: "Accept"
        },
        {
          id: "123463",
          date: "14/05/19",
          item: "Keychain",
          image: "image",
          quantity: "2",
          status: "Ordered",
          actions: "Accept"
        },
        {
          id: "123464",
          date: "23/04/19",
          item: "Keychain + A5 Photo",
          image: "image",
          quantity: "2",
          status: "Completed",
          actions: "Archive"
        },
        {
          id: "123465",
          date: "26/04/19",
          item: "A5 Photo",
          image: "image",
          quantity: "1",
          status: "Ordered",
          actions: "Accept"
        },
        {
          id: "123466",
          date: "16/04/19",
          item: "A3 Photo",
          image: "image",
          quantity: "2",
          status: "Delivering",
          actions: "Completed"
        }
      ]);


    this.sortItems = this.items;

//creating checkbox.
    let index;
    for(index = 0; this.sortItems.length> index; index++){
    this.sortItems[index].checkbox = "checkbox"
    
    }

    this.onTabChange(0);

 
  },

  methods: {
    onTabChange(id) {
      //const {sortItems, items, noOfTabs, Tabs, selectedTab, typesOfTabs} = this
      //reason why i don't use const ^ is because when the data is displayed,
      //it will become read-only.

      this.sortItems = [];
      //change background color for the tab
      this.noOfTabs = this.$refs.tabs.childElementCount;

      if (!this.Tabs[id].isDark) this.Tabs[id].isDark = true;

      this.selectedTab = id;
      var index;

      for (index = 0; index < this.Tabs.length; index++) {
        if (id != this.Tabs[index].id)
          if (this.Tabs[index].isDark) this.Tabs[index].isDark = false;
      }
      //manipulate table data after changing tab color

      let sortBy = this.typesOfTabs[id];

      for (index = 0; index < this.items.length; index++)
        if (sortBy === this.items[index].status)
          this.sortItems.push(this.items[index]);

      //for counting the amount of rows in each tab.
      let numberOfRows = 0;
      let x;
      //index is 1 so as to skip the All tab. then i push a 0 on the first
      //number of the arrayofNumberOfRows.
      this.arrayOfNumberOfRows.push(null)
      for(index = 1; index < this.typesOfTabs.length; index++){
        numberOfRows = 0;
        for(x = 0; x< this.items.length; x++)
        {
         if(this.items[x].status == this.typesOfTabs[index])
          numberOfRows++;

        }
          this.arrayOfNumberOfRows.push(numberOfRows)
      }
     

      if (sortBy === "All") this.sortItems = this.items;

      //to disable checkbox is All tabs are selected
      if (sortBy == "All") 
      this.enableCheckbox = false
      else
      this.enableCheckbox = true

      if (this.forceRender) this.forceRender = false;
      else this.forceRender = true;
    },
  
  }
};
</script>

<style>
</style>