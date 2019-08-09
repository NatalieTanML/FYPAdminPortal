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
    Table,
    Footer
  },
  data() {
    return {
      headerButtonClick: ["Add Hotel"],
      headerButton: [{ id: 1, title: "Add Hotel" }],
      actionButtonClick: "Edit Hotel",
      items: [],
      fields: [
        { key: "id", label: "", sortable: true },
        { key: "name", label: "Hotel Name", sortable: true },
        { key: "address", label: "Hotel Address", sortable: true },
        { key: "postalCode", label: "Hotel Postal Code" },
        { key: "isEnabled", label: "Is Enabled" },
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
    },
    getEnabled(isEnabled) {
      if (isEnabled) return "Yes";
      else return "No";
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

    //get all hotels to be displayed in the table.
    this.$store
      .dispatch(GET_ALL_HOTELS)
      .then(response => {

        for (var x = 0; x < response.length; x++) {
          this.items.push({
            id: response[x].value,
            name: response[x].text,
            address: response[x].hotelAddress,
            postalCode: response[x].hotelPostalCode,
            isEnabled: this.getEnabled(response[x].isActive),
            actions: ["Edit Hotel"]
          });
        }
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