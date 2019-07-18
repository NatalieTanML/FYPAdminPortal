<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
     
          <DashboardHeader title="Hotel Management"></DashboardHeader>
         
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
import {
  GET_ALL_HOTELS,
  GET_ONE_HOTEL,
  CREATE_HOTEL,
  UPDATE_ONE_HOTEL,
  DELETE_HOTEL
} from "@/store/actions/hotel";

export default {
  components: {
    SideBar,
    DashboardHeader,
    Table
  },
  data() {
    return {
      headerButtonClick: ["Add Hotel"],
      headerButton: [{ id: 1, title: "Add Hotel" }],
      actionButtonClick: "Edit Hotel",
      forceRender: true,
      items: [],
      fields: [
        { key: "id", label: "", sortable: true },
        { key: "name", label: "Hotel Name", sortable: true },
        { key: "address", label: "Hotel Address", sortable: true },
        { key: "postalCode", label: "Hotel Postal Code" },
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
      this.$router.replace({ name: "AddHotel" });
    });

    eventBus.$on(this.actionButtonClick, id => {
      localStorage.setItem("updateHotelId", id);
      this.$router.replace({ name: "UpdateHotel" });
    });

    this.$store
      .dispatch(GET_ALL_HOTELS)
      .then(response => {
        console.log(response);

        for (var x = 0; x < response.length; x++) {
          //  this.Tabs[x] = {title: typesOfTabs[x], id : x, isDark: false}
          //item: response[x].orderItems[0].options[0].product.productName,
          this.items.push({
            id: response[x].value,
            name: response[x].text,
            address: response[x].hotelAddress,
            postalCode: response[x].hotelPostalCode,
            actions: ["Edit Hotel"]
          });
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