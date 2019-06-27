<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
    
          <DashboardHeader title="Resource Management"></DashboardHeader>
          <!-- Topbar Navbar -->
         

        <div>
          <Table
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:headerButtonClick="this.headerButtonClick"
            headerButton="Add Resource"
            v-bind:fields="this.fields"
            v-bind:items="this.items"
          ></Table>
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
  </div>
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
      headerButtonClick: "Add One Resource",
      actionButtonClick: "Edit One Resource",
      items: [
        {
          id: "SKU_123",
          name: "Key Chain",
          qtyLeft: "100",
          originalPrice: "$5.90",
          activeDiscount: "25%",
          status: "Awaiting Print",
          actions: "Edit"
        },
        {
          id: "SKU_345",
          name: "A5 Photo",
          qtyLeft: "75",
          originalPrice: "$4.90",
          activeDiscount: "-",
          status: "Printed",
          actions: "Edit"
        },
        {
          id: "SKU_567",
          name: "ID Card",
          qtyLeft: "50",
          originalPrice: "$6.90",
          activeDiscount: "-",
          actions: "Edit"
        }
      ],
      fields: [
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "qtyLeft", label: "Qty Left", sortable: true },
        { key: "originalPrice", label: "Original Price", sortable: true },
        { key: "activeDiscount", label: "Active Discount", sortable: true },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    eventBus.$on(this.headerButtonClick, () => {
      this.$router.replace({ name: "AddResource" });
    });

    eventBus.$on(this.actionButtonClick, () => {
      this.$router.replace({ name: "UpdateResource" });
    });
  }
};
</script>

<style>
</style>
