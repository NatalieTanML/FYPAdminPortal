<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->

        <DashboardHeader title="Update Hotel"></DashboardHeader>
        <!-- Topbar Navbar -->

        <!-- End of Topbar -->

        <!-- Begin Page Content -->

        <div class="container-fluid">
          <!-- Main Content -->
          <div id="content">
            <div class="row mb-4">
              <b-container fluid>
                <b-row class="bg-white text-left" align-h="center" align-v="center">
                  <b-col cols="8" class="my-5">
                    <b-form class="resource-form">
                      <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                        <b-form-group label-cols-sm="3" label="Hotel Name" label-for="input-horizontal">
                         <input type="text" v-model="hotel.name" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter The Hotel Name...">
                      </b-form-group>

                      <b-form-group label-cols-sm="3" label="Hotel Address" label-for="input-horizontal">
                         <input type="text" v-model="hotel.address" class="form-control form-control-user" aria-describedby="" placeholder="Enter The Hotel Address...">
                      </b-form-group>

                        <b-form-group label-cols-sm="3" label="Hotel Postal Code" label-for="input-horizontal">
                         <input type="text" v-model="hotel.postalCode" class="form-control form-control-user" aria-describedby="" placeholder="Enter The Hotel Postal Code...">
                      </b-form-group>

                      <b-form-group
                        label-cols-sm="3"
                        label="Delete Hotel"
                        label-for="input-horizontal"
                      >
                        <b-button v-b-modal.deleteHotel class="w-25" variant="danger">Delete</b-button>
                      </b-form-group>


                      <b-form-group label-cols-sm="3" label-for="input-horizontal">
                        <b-button class="w-25" v-on:click="saveHotel()" variant="primary">Save</b-button>
                        <b-button class="w-25" style="margin-left:2em " variant="secondary">Cancel</b-button>
                      </b-form-group>
                    </b-form>
                  </b-col>
                </b-row>
              </b-container>

              <b-modal @ok="handleok()" id="deleteHotel" title="Delete Hotel">
                <p class="my-4">Are you sure you want to delete this Hotel?</p>
                <p class="my-4">This action cannot be undone.</p>
              </b-modal>

        
            </div>
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
import {
  GET_ONE_HOTEL,
  UPDATE_ONE_HOTEL,
  DELETE_HOTEL
} from "@/store/actions/hotel";

export default {
  data() {
    return {
      hotel: {
        id: "",
        name: "",
        address: "",
        postalCode: ""
      }
    };
  },
  components: {
    SideBar,
    DashboardHeader
  },
  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },
    getHotelInformation() {
      this.hotel.id = localStorage.getItem("updateHotelId");

      this.$store
        .dispatch(GET_ONE_HOTEL, this.hotel.id)
        .then(response => {
          console.log(response);
          this.hotel.name = response.hotelName;
          this.hotel.address = response.hotelAddress;
          this.hotel.postalCode = response.hotelPostalCode;
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
          //this.$router.replace({name:'SummaryOfOrders'});
        });
    },
    saveHotel() {
      const hotelStr = {
        HotelId: this.hotel.id,
        HotelName: this.hotel.name,
        HotelAddress: this.hotel.address,
        HotelPostalCode: this.hotel.postalCode
      };

      this.$store
        .dispatch(UPDATE_ONE_HOTEL, hotelStr)
        .then(response => {
          this.message("success", "Hotel is updated!");
        })
        .catch(error => {
          this.message("danger", error);
        });
    },
    handleok() {
      this.$store
        .dispatch(DELETE_HOTEL, this.hotel.id)
        .then(response => {
          this.message("success", response.message);
          this.$router.replace({ name: "HotelManagement" });
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error.response.data.message);
        });
    }
  },
  mounted() {
    this.getHotelInformation();
  }
};
</script>

<style>
</style>