<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <DashboardHeader title="Add Hotel"></DashboardHeader>
        <!-- Topbar Navbar -->

        <!-- End of Topbar -->

        <!-- Begin Page Content -->

        <div class="container-fluid">
          <div class="card shadow mb-4">
            <!-- Main Content -->
            <div id="content">
              <div class="row my-4">
                <b-container fluid>
                  <b-row class="bg-white text-left" align-h="center">
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

                        <b-form-group label-cols-sm="3" label-for="input-horizontal">
                          <b-button v-on:click="addHotel" variant="primary">Add Hotel</b-button>
                        </b-form-group>
                      </b-form>
                    </b-col>
                  </b-row>
                </b-container>
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
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { CREATE_HOTEL } from "@/store/actions/hotel";
import { required } from "vuelidate/lib/validators";
export default {
  components: {
    SideBar,
    DashboardHeader,
    Footer
  },

  data() {
    return {
      validate: false,
      hotel: {
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

  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    //add a new hotel
    addHotel() {
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
          HotelName: this.hotel.name,
          HotelAddress: this.hotel.address,
          HotelPostalCode: this.hotel.postalCode
        };

        this.$store
          .dispatch(CREATE_HOTEL, hotelStr)
          .then(response => {
            this.message("success", response.message);
          })
          .catch(error => {
            console.dir(error);
            this.message("danger", error.response.data.message);
          });
      }
    }
  },

  mounted() {}
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