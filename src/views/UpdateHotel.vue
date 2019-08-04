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
          <div class="card shadow mb-4">
            <!-- Main Content -->
            <div id="content">
              <div class="row my-4">
                <b-container fluid>
                  <b-row class="bg-white text-left" align-h="center" align-v="center">
                    <b-col lg="8" md="10" cols="11">
                      <b-form class="resource-form">
                        <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                        <b-form-group
                          label-cols-sm="3"
                          label="Hotel Name"
                          label-for="input-horizontal"
                        >
                          <input
                            type="text"
                            v-model="hotel.name"
                            class="form-control form-control-user"
                            aria-describedby="emailHelp"
                            placeholder="Hotel name"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.hotel.name.required"
                          >Hotel name is required!</div>
                        </b-form-group>

                        <b-form-group
                          label-cols-sm="3"
                          label="Hotel Address"
                          label-for="input-horizontal"
                        >
                          <input
                            type="text"
                            v-model="hotel.address"
                            class="form-control form-control-user"
                            aria-describedby
                            placeholder="Hotel address"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.hotel.address.required"
                          >Hotel address is required!</div>
                        </b-form-group>

                        <b-form-group
                          label-cols-sm="3"
                          label="Hotel Postal Code"
                          label-for="input-horizontal"
                        >
                          <input
                            type="text"
                            v-model="hotel.postalCode"
                            class="form-control form-control-user"
                            aria-describedby
                            placeholder="Hotel postal code"
                          />
                          <div
                            class="error-message"
                            v-if="validate && !$v.hotel.postalCode.required"
                          >Hotel postal code is required!</div>
                        </b-form-group>

                        <b-form-group
                          label-cols-sm="3"
                          label="Is Enabled"
                          label-for="input-horizontal"
                        >
                          <b-form-checkbox v-model="isEnabled" name="check-button" size="lg" switch></b-form-checkbox>
                        </b-form-group>

                        <b-form-group label-cols-sm="3" label-for="input-horizontal">
                          <b-button v-on:click="saveHotel()" variant="primary">Save</b-button>
                          <b-button
                            class="ml-2"
                            v-on:click="cancelButton()"
                            variant="secondary"
                          >Cancel</b-button>
                        </b-form-group>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-container>

                <b-modal @ok="handleok()" id="deleteHotel" title="Delete Hotel">
                  <p>Are you sure you want to delete this Hotel?</p>
                  <p>This action cannot be undone.</p>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

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
import Footer from "@/components/Footer";
import { required } from "vuelidate/lib/validators";

import {
  GET_ONE_HOTEL,
  UPDATE_ONE_HOTEL,
  DELETE_HOTEL
} from "@/store/actions/hotel";

export default {
  data() {
    return {
      validate: false,
      isEnabled: false,
      hotel: {
        id: null,
        name: null,
        address: null,
        postalCode: null
      }
    };
  },
  validations: {
    hotel: {
      name: {
        required
      },
      address: {
        required
      },
      postalCode: {
        required
      }
    }
  },
  components: {
    SideBar,
    DashboardHeader,
    Footer
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
          this.isEnabled = response.isActive;
          this.validate = true;
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
          //this.$router.replace({name:'SummaryOfOrders'});
        });
    },
    cancelButton() {
      this.$router.replace({ name: "HotelManagement" });
    },
    saveHotel() {
      this.validate = true;
      if (this.hotel.name == "") this.hotel.name = null;

      if (this.hotel.address == "") this.hotel.address = null;

      if (this.hotel.postalCode == "") this.hotel.postalCode = null;

      if (
        this.hotel.name != null &&
        this.hotel.address != null &&
        this.hotel.postalCode != null
      ) {
        const hotelStr = {
          HotelId: this.hotel.id,
          HotelName: this.hotel.name,
          HotelAddress: this.hotel.address,
          HotelPostalCode: this.hotel.postalCode,
          IsActive: this.isEnabled
        };

        this.$store
          .dispatch(UPDATE_ONE_HOTEL, hotelStr)
          .then(response => {
            this.message("success", response.message);
          })
          .catch(error => {
            this.message("danger", error);
          });
      }
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

<style scoped>
.error-message {
  color: #dc3545;
  display: inline-block;
  margin-top: 0.5em;
  margin-left: 0.5em;
}
</style>