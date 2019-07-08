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
              <ul class="nav" ref="tabs"></ul>
            </div>
          </div>
        </div>
        <div v-if="order != null">
          <b-container fluid class="bg-white text-left" align-h="center">
            <div class="card shadow">
              <div class="card-header py-3">
                <h4 class="mb-3">Order Information</h4>

                <b-row class="b1 mb-2">
                  <b-col>Order No.</b-col>
                  <b-col>Created At</b-col>
                  <b-col>Subtotal</b-col>
                  <b-col>Status</b-col>
                </b-row>

                <b-row>
                  <b-col cols="3">{{order.orderId}}</b-col>
                  <b-col
                    cols="3"
                  >{{new Date(Date.parse(order.createdAt)).toLocaleString()}}</b-col>
                  <b-col cols="3">
                    {{order.orderTotal | currency}}
                  </b-col>
                  <b-col cols="3">{{order.status}}</b-col>
                </b-row>

                <b-row class="b1 mb-2">
                  <b-col class="b3">Reference No.</b-col>
                  <b-col class="b3">Updated At</b-col>
                  <b-col class="b3">Updated By</b-col>
                  <b-col class="b3">Deliver By</b-col>
                </b-row>

                <b-row>
                  <b-col cols="3">{{order.referenceNo}}</b-col>
                  <b-col
                    cols="3"
                  >{{new Date(Date.parse(order.updatedAt)).toLocaleString()}}</b-col>
                  <b-col v-if="order.updatedBy == null" cols="3">N/A</b-col>
                  <b-col v-else cols="3">{{order.updatedBy}}</b-col>
                  <b-col v-if="order.deliveryMan.name == null" cols="3">Not Assigned</b-col>
                  <b-col v-else cols="3">{{order.deliveryMan.name}}</b-col>
                </b-row>
                <b-row class="b4 mb-2">
                  <b-col class="b3">Actions</b-col>
                  <b-col class="b3"></b-col>
                  <b-col class="b3"></b-col>
                </b-row>
                <b-row class="mb-2">
                  <b-col cols="5">
                    <b-button
                      type="button"
                      lg="4"
                      class="btnAction"
                      variant="primary"
                      size="sm"
                    >{{getAction(order.status)}}</b-button>
                  </b-col>
                  <b-col class="b3"></b-col>
                  <b-col class="b3"></b-col>
                  <b-col class="b3"></b-col>
                </b-row>

                <b-row class="b2">
                  <b-col cols="3">Item(s)</b-col>
                  <b-col cols="3">Image</b-col>
                  <b-col cols="2">Cost</b-col>
                  <b-col cols="2">Qty</b-col>
                  <b-col cols="2">Discount</b-col>
                </b-row>
                <hr class="mb-3">

                <b-row style="height: 150px;" v-for="(orderItem) in order.orderItems" v-bind:key="orderItem.orderId">
                  <b-col
                    cols="3"
                  >{{orderItem.options.product.productName}}({{orderItem.options.optionValue}}) {{orderItem.options.skuNumber}}</b-col>
                  <b-col cols="3">
                     <img
                     @click="onImageClick(orderItem.orderImageKey)"
                     style="height: 100px; max-height: 150px"
                    v-bind:src="orderItem.orderImageUrl"
                  />
                  </b-col>
                  <b-col cols="2">
                    {{orderItem.options.product.price | currency}}
                  </b-col>
                  <b-col cols="2">{{orderItem.quantity}}</b-col>
                  <b-col cols="2">N/A</b-col>
                </b-row>
                <hr class="mb-3">

                <b-row>
                  <b-col cols="10"></b-col>
                  <b-col  cols="2"><span>Total :</span><span> {{order.orderTotal | currency}}</span></b-col>
               
                </b-row>
              </div>
            </div>
          </b-container>

          <b-container fluid class="card2 bg-white text-left mb-5" align-h="center">
            <div class="card shadow mb-4">
              <div class="card-header py-3">
                <h4 class="mb-3">Customer Information</h4>

                <b-row class="b1 mb-2">
                  <b-col>Email Address</b-col>
                  <b-col>Billing</b-col>
                  <b-col>Shipping</b-col>
                  <b-col>Special Request</b-col>
                </b-row>

                <b-row>
                  <b-col cols="3" v-if="order.emailString == null">N/A</b-col>
                  <b-col cols="3" v-else>{{order.emailString}}</b-col>
                  <b-col cols="3" v-if="order.addressId == null">Self Pick-up</b-col>
                  <b-col
                    cols="3"
                    v-else
                  >{{order.address.hotel.hotelName}} {{order.address.unitNo}}, {{order.address.addressLine1}} {{order.address.addressLine2}}, {{order.address.postalCode}} {{order.address.state}} {{order.address.country}}</b-col>
                  <b-col cols="3" v-if="order.addressId == null">Self Pick-up</b-col>
                  <b-col
                    cols="3"
                    v-else
                  >{{order.address.hotel.hotelName}} {{order.address.unitNo}}, {{order.address.addressLine1}} {{order.address.addressLine2}}, {{order.address.postalCode}} {{order.address.state}} {{order.address.country}}</b-col>
                  <b-col cols="3" v-if="order.request == null">N/A</b-col>
                  <b-col cols="3" v-else>{{order.request}}</b-col>
                </b-row>
              </div>
            </div>
          </b-container>
        </div>
        <div v-else>
          <b-container fluid class="bg-white text-left" align-h="center">
            <div class="card shadow">
              <div class="card-header py-3">
                <h4 class="mb-3">Error, No Order Data Retrived !</h4>
              </div>
            </div>
          </b-container>
        </div>
        <p>{{time}}</p>

        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright &copy; Your Website 2019</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import { ORDER_GET_REQUEST, GET_PRESIGNED_URL } from "@/store/actions/order";

export default {
  components: {
    SideBar,
    DashboardHeader
  },
  data() {
    return {
      pad: null,
      order: null,
      time: ""
    };
  },

  methods: {
    
    onImageClick(thumbNailUrl){
      console.log(thumbNailUrl)
        var listOfThumbNailUrl = [];
        listOfThumbNailUrl.push(thumbNailUrl);
        this.$store
        .dispatch(GET_PRESIGNED_URL, listOfThumbNailUrl)
        .then(response => {
        console.log(response)
        let index;

        var interval = setInterval(download, 300, response.imgUrls);

        function download(urls) {
         var url = urls.pop();
        console.log(url)
         var a = document.createElement("a");
         a.setAttribute('href', url);
         a.setAttribute('download', '');
         a.setAttribute('target', '_blank');
         a.click();

        if (urls.length == 0) {
          clearInterval(interval);
        }
}

        // this.presignedUrl = response.imgUrls[0];
        // this.$bvModal.show("viewPresignedImage");
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });

    },
       getAction(status) {
        if (status == "Received")
          return "Accept Order"
        else if (status == "Awaiting Printing")
          return "Print"
        else if (status == "Printed")
          return "Deliver"
        else if (status == "Out for Delivery")
          return "Delivered"
        else if (status == "Completed")
          return null
        else if (status == "Delivery Failed")
          return "Re-Deliver"
        else if (status == "Cancelled")
          return null
        else
          return null
      },
  },
  mounted() {
    const orderId = localStorage.getItem("viewOrderId");

    this.$store
      .dispatch(ORDER_GET_REQUEST, orderId)
      .then(response => {
        this.order = response;
      })
      .catch(error => {
        alert("error", error.response.data.message);
      });
  }
};
</script>

<style>
.pad {
  border: 2px solid #cbc9c6;
  border-radius: 5px;
}
.b1 {
  font-weight: bold;
}
.b2 {
  font-weight: bold;
  padding-top: 30px;
}
.b3 {
  padding-top: 10px;
}
.b4 {
  font-weight: bold;
  padding-top: 10px;
}
.card2 {
  padding-top: 20px;
}
.btnAction {
  width: 30%;
}
.orderInfo {
  max-width: 100%;
}
</style>
