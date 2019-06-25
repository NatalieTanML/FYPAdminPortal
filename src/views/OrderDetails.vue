<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
        <DashboardHeader title="Order Details"></DashboardHeader>
          <!-- Topbar Navbar -->
       
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        
        <b-container class="bv-example-row">
  <b-row>
    <b-col>1 of 3</b-col>
    <b-col>2 of 3</b-col>
    <b-col>3 of 3</b-col>
  </b-row>
</b-container>
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
import LayoutPlugin  from 'bootstrap-vue'

export default {
  components: {
    SideBar,
    DashboardHeader,
    DashboardTabs,
    Table,
    LayoutPlugin
  },
  data() {
    return {
      noOfTabs: 0,
      selectedTab: 0,
      pad: null,


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
  },
  mounted() {
    
  }
};
</script>

<style>
.pad {
  border: 2px solid #cbc9c6;
  border-radius: 5px;
}
</style>