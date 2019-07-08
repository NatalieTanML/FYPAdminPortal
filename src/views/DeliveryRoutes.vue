<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
        <!-- Topbar Navbar -->
        <DashboardHeader title="Delivery Routes"></DashboardHeader>

        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <!-- Main Content -->
        <div id="content">
          <div>
            <!-- headerButton="Assign Selected to Deliveryman" -->
            <Table
              v-bind:headerButtonClick="this.headerButtonClick"
              v-bind:actionButtonClick="this.actionButtonClick"
              v-bind:fields="this.fields"
              v-bind:items="this.items"
            ></Table>
            <b-modal
              @ok="updateDeliveryman()"
              id="delivery-routes-modal"
              title="Assign to Deliveryman"
              ok-title="Save"
            >
              <b-row align-v="center">
                <b-col cols="4">Deliveryman</b-col>
                <b-col>
                  <b-form-select v-model="selected" :options="deliveryman"></b-form-select>
                </b-col>
              </b-row>
            </b-modal>
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
import OrderHub from "@/services/orderHub.js";
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import { eventBus } from "@/eventBus";
import { GET_ALL_ORDERS, UPDATE_DELIVERYMAN } from "@/store/actions/order";
import { GET_ALL_DELIVERYMEN } from "@/store/actions/user";

export default {
  components: {
    SideBar,
    DashboardHeader,
    Table
  },
  data() {
    return {
      connection: null,
      actionButtonClick: "Assign One to Deliveryman",
      headerButton: [{id: 1, title: "Assign to Deliveryman"}],
      headerButtonClick: ["Assign to Deliveryman"],
      id: "",
      items: [],
      fields: [
        { key: "refNo", label: "Ref. No", sortable: true },
        { key: "region", label: "Region", sortable: true },
        { key: "postcode", label: "Postcode", sortable: true },
        { key: "deliveryman", label: "Deliveryman", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      selected: null,
      deliveryman: [],
      allOrders: [],
      allDeliverymen: [],
    };
  },

  methods: {
    getRegionByPostalCode(postcode) {
      if (postcode.length == 6) {
        if (
          postcode.substring(0, 2) == "01" ||
          postcode.substring(0, 2) == "02" ||
          postcode.substring(0, 2) == "03" ||
          postcode.substring(0, 2) == "04" ||
          postcode.substring(0, 2) == "05" ||
          postcode.substring(0, 2) == "06"
        )
          return "Raffles Place, Cecil, Marina, People’s Park";
        if (
          postcode.substring(0, 2) == "07" ||
          postcode.substring(0, 2) == "08"
        )
          return "Anson, Tanjong Pagar";
        if (
          postcode.substring(0, 2) == "09" ||
          postcode.substring(0, 2) == "10"
        )
          return "Telok Blangah, Harbourfront";
        if (
          postcode.substring(0, 2) == "11" ||
          postcode.substring(0, 2) == "12" ||
          postcode.substring(0, 2) == "13"
        )
          return "Pasir Panjang, Hong Leong Garden, Clementi New Town";
        if (
          postcode.substring(0, 2) == "14" ||
          postcode.substring(0, 2) == "15" ||
          postcode.substring(0, 2) == "16"
        )
          return "Queenstown, Tiong Bahru";
        if (postcode.substring(0, 2) == "17")
          return "High Street, Beach Road (part)";
        if (
          postcode.substring(0, 2) == "18" ||
          postcode.substring(0, 2) == "19"
        )
          return "Middle Road, Golden Mile";
        if (
          postcode.substring(0, 2) == "20" ||
          postcode.substring(0, 2) == "21"
        )
          return "Little India";
        if (
          postcode.substring(0, 2) == "22" ||
          postcode.substring(0, 2) == "23"
        )
          return "Orchard, Cairnhill, River Valley";
        if (
          postcode.substring(0, 2) == "24" ||
          postcode.substring(0, 2) == "25" ||
          postcode.substring(0, 2) == "26" ||
          postcode.substring(0, 2) == "27"
        )
          return "Ardmore, Bukit Timah, Holland Road, Tanglin";
        if (
          postcode.substring(0, 2) == "28" ||
          postcode.substring(0, 2) == "29" ||
          postcode.substring(0, 2) == "30"
        )
          return "Watten Estate, Novena, Thomson";
        if (
          postcode.substring(0, 2) == "31" ||
          postcode.substring(0, 2) == "32" ||
          postcode.substring(0, 2) == "33"
        )
          return "Balestier, Toa Payoh, Serangoon";
        if (
          postcode.substring(0, 2) == "34" ||
          postcode.substring(0, 2) == "35" ||
          postcode.substring(0, 2) == "36" ||
          postcode.substring(0, 2) == "37"
        )
          return "Macpherson, Braddell";
        if (
          postcode.substring(0, 2) == "38" ||
          postcode.substring(0, 2) == "39" ||
          postcode.substring(0, 2) == "40" ||
          postcode.substring(0, 2) == "41"
        )
          return "Geylang, Eunos";
        if (
          postcode.substring(0, 2) == "42" ||
          postcode.substring(0, 2) == "43" ||
          postcode.substring(0, 2) == "44" ||
          postcode.substring(0, 2) == "45"
        )
          return "Katong, Joo Chiat, Amber Road";
        if (
          postcode.substring(0, 2) == "46" ||
          postcode.substring(0, 2) == "47" ||
          postcode.substring(0, 2) == "48"
        )
          return "Bedok, Upper East Coast, Eastwood, Kew Drive";
        if (
          postcode.substring(0, 2) == "49" ||
          postcode.substring(0, 2) == "50" ||
          postcode.substring(0, 2) == "81"
        )
          return "Loyang, Changi";
        if (
          postcode.substring(0, 2) == "51" ||
          postcode.substring(0, 2) == "52"
        )
          return "Tampines, Pasir Ris";
        if (
          postcode.substring(0, 2) == "53" ||
          postcode.substring(0, 2) == "54" ||
          postcode.substring(0, 2) == "55" ||
          postcode.substring(0, 2) == "82"
        )
          return "Serangoon Garden, Hougang, Punggol";
        if (
          postcode.substring(0, 2) == "56" ||
          postcode.substring(0, 2) == "57"
        )
          return "Bishan, Ang Mo Kio";
        if (
          postcode.substring(0, 2) == "58" ||
          postcode.substring(0, 2) == "59"
        )
          return "Upper Bukit Timah, Clementi Park, Ulu Pandan";
        if (
          postcode.substring(0, 2) == "60" ||
          postcode.substring(0, 2) == "61" ||
          postcode.substring(0, 2) == "62" ||
          postcode.substring(0, 2) == "63" ||
          postcode.substring(0, 2) == "64"
        )
          return "Jurong";
        if (
          postcode.substring(0, 2) == "65" ||
          postcode.substring(0, 2) == "66" ||
          postcode.substring(0, 2) == "67" ||
          postcode.substring(0, 2) == "68"
        )
          return "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang";
        if (
          postcode.substring(0, 2) == "69" ||
          postcode.substring(0, 2) == "70" ||
          postcode.substring(0, 2) == "71"
        )
          return "Lim Chu Kang, Tengah";
        if (
          postcode.substring(0, 2) == "72" ||
          postcode.substring(0, 2) == "73"
        )
          return "Kranji, Woodgrove";
        if (
          postcode.substring(0, 2) == "77" ||
          postcode.substring(0, 2) == "78"
        )
          return "Upper Thomson, Springleaf";
        if (
          postcode.substring(0, 2) == "75" ||
          postcode.substring(0, 2) == "76"
        )
          return "Yishun, Sembawang";
        if (
          postcode.substring(0, 2) == "79" ||
          postcode.substring(0, 2) == "80"
        )
          return "Seletar";
        else return "Postalcode does not match any district in Singapore";
      } else return "Postalcode does not match any district in Singapore";
    },

    refreshTable() {
      this.$store
        .dispatch(GET_ALL_ORDERS)
        .then(response => {
          this.allOrders = response;
          for (var i = 0; i < this.allOrders.length; i++) {
            this.items[i].id = this.allOrders[i].orderId;
            this.items[i].refNo = this.allOrders[i].referenceNo;
            this.items[i].postcode = this.allOrders[i].address.postalCode;
            this.items[i].region = this.getRegionByPostalCode(
              this.items[i].postcode
            );
            if (this.allOrders[i].deliveryManId != null) {
              this.items[i].actions = ["Update Deliveryman"];
              this.items[i].deliveryman = this.allOrders[i].deliveryMan.name;
            } else {
              this.items[i].actions = ["Assign Deliveryman"];
              this.items[i].deliveryman = "Not Assigned";
            }
          }
        })
        .catch(error => {
          alert(error);
        });
    },

    updateDeliveryman() {
      for (var i = 0; i < this.allDeliverymen.length; i++) {
        if (this.allDeliverymen[i].email == this.selected) {
          this.$store
            .dispatch(UPDATE_DELIVERYMAN, [this.id, this.allDeliverymen[i].id])
            .then(response => {
              this.refreshTable();
            })
            .catch(error => {
              alert(error);
            });
        }
      }
    }
  },
  
  async mounted() {
    eventBus.$on(this.actionButtonClick, id => {
      this.$bvModal.show("delivery-routes-modal");
      this.id = id;
    });
    // eventBus.$on(this.headerButtonClick[0], () => {
    //   console.log("Header button clicked");
    // });
    this.$store
      .dispatch(GET_ALL_ORDERS)
      .then(response => {
        this.allOrders = response;
        for (var i = 0; i < this.allOrders.length; i++) {
          this.items.push({
            refNo: "",
            region: "",
            postcode: "",
            deliveryman: "",
            actions: ""
          });
          this.items[i].id = this.allOrders[i].orderId;
          this.items[i].refNo = this.allOrders[i].referenceNo;
          this.items[i].postcode = this.allOrders[i].address.postalCode;
          this.items[i].region = this.getRegionByPostalCode(
            this.items[i].postcode
          );
          if (this.allOrders[i].deliveryManId != null) {
            this.items[i].actions = ["Update Deliveryman"];
            this.items[i].deliveryman = this.allOrders[i].deliveryMan.name;
          } else {
            this.items[i].actions = ["Assign Deliveryman"];
            this.items[i].deliveryman = "Not Assigned";
          }
        }
      })
      .catch(error => {
        alert(error);
      });
    this.$store
      .dispatch(GET_ALL_DELIVERYMEN)
      .then(response => {
        this.allDeliverymen = response;
        this.deliveryman.push({
          value: null,
          text: "Please select an option"
        });
        for (var i = 0; i < this.allDeliverymen.length; i++) {
          this.deliveryman.push({
            value: null,
            text: ""
          });
          this.deliveryman[i + 1].value = this.allDeliverymen[i].email;
          this.deliveryman[i + 1].text = this.allDeliverymen[i].name;
        }
      })
      .catch(error => {
        alert(error);
      });

    // Establish hub connection
    this.connection = await OrderHub.connectToOrderHub();
    this.connection
      .start()
      .then(() => {
        console.log("Connection to hub started");
      })
      .catch(err => console.log(err));

    // Establish hub methods 
    this.connection.on("OneOrder", order => {
      console.log("OneOrder called");
      console.log(order);
      this.refreshTable();
    });

    this.connection.on("MultipleOrders", orders => {
      console.log("MultipleOrders called");
      console.log(orders);
      this.refreshTable();
    });
    // // Connect to hub
    // this.connection
    //   .start()
    //   .then(response => {
    //     console.log("Connection to hub started");
    //   })
    //   .catch(err => {
    //     console.error("Connection failed", err.toString());
    //   });
  },

  async beforeDestroy() {
    this.connection.stop();
  }
};
</script>

<style>
</style>