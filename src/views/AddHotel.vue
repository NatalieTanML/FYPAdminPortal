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
          <!-- Main Content -->
          <div id="content">
            <div class="row mb-4">
              <b-container fluid>
                <b-row class="bg-white text-left" align-h="center">
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



                      <b-form-group label-cols-sm="3" label-for="input-horizontal">
                        <b-button class="w-25"  v-on:click="addHotel" variant="primary">Add Hotel</b-button>
                      </b-form-group>

                    </b-form>
                  </b-col>
                </b-row>
              </b-container>
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

                
                 
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import { CREATE_HOTEL } from "@/store/actions/hotel";
import { required } from "vuelidate/lib/validators";
export default {
  components: {
    SideBar,
    DashboardHeader
  },

  data() {
    return {
      hotel: {
        name: "",
        address: "",
        postalCode: ""
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
    addHotel() {
      const hotelStr = {
        HotelName: this.hotel.name,
        HotelAddress: this.hotel.address,
        HotelPostalCode: this.hotel.postalCode
      };

      this.$store
        .dispatch(CREATE_HOTEL, hotelStr)
        .then(() => {
          this.message("success", "You have added a new hotel!");
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error.response.data.message);
        });
    }
  },

  mounted() {}
};
</script>

<style scoped>
</style>