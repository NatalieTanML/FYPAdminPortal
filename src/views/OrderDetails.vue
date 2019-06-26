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
              <ul class="nav" ref="tabs">
           
              </ul>
            </div>
          </div>
        </div>

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
                <b-col>{{order.orderId}}</b-col>
                <b-col>{{order.createdAt}}</b-col>
                <b-col>${{order.orderTotal}}</b-col>
                <b-col>
                  <b-button
                    type="button"
                    lg="4"
                    class="w-75"
                    variant="primary"
                    size="sm"
                  >{{order.status}}</b-button>
                </b-col>
              </b-row>

              <b-row class="b1 mb-2">
                <b-col class="b3">Reference No.</b-col>
                <b-col class="b3">Updated At</b-col>
                <b-col class="b3">Updated By</b-col>
                <b-col class="b3">Deliver By</b-col>
              </b-row>

              <b-row>
                <b-col>{{order.referenceNo}}</b-col>
                <b-col>{{order.updatedAt}}</b-col>
                <b-col v-if="order.updatedBy == null">N/A</b-col>
                <b-col v-else>{{order.updatedBy}}</b-col>
                <b-col v-if="order.deliveryMan.name == null">Not Assigned</b-col>
                <b-col v-else>{{order.deliveryMan.name}}</b-col>
              </b-row>

              <b-row class="b2">
                <b-col cols="8">Item(s)</b-col>
                <b-col>Image Url</b-col>
                <b-col>Cost</b-col>
                <b-col>Qty</b-col>
                <b-col>Discount</b-col>
              </b-row>
              <hr class="mb-3">

              <b-row v-for="(orderItem) in order.orderItems" v-bind:key="orderItem">
                <b-col cols="8">{{orderItem.options.product.productName}}({{orderItem.options.optionValue}}) {{orderItem.options.skuNumber}}</b-col>
                <b-col>
                  <a :href="orderItem.orderImageUrl">Click Here</a>
                </b-col>
                <b-col>${{orderItem.options.product.price}}</b-col>
                <b-col>{{orderItem.quantity}}</b-col>
                <b-col>NA</b-col>
              </b-row>
              <hr class="mb-3">

              <b-row>
                <b-col cols="8"></b-col>
                <b-col></b-col>
                <b-col class="total">Total :</b-col>
                <b-col class="total">${{order.orderTotal}}</b-col>
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
                <b-col>{{order.emailString}}</b-col>
                <b-col v-if="order.addressId == null">Self Pick-up</b-col>
                <b-col v-else>{{order.address.hotel.hotelName}}, {{order.address.addressLine1}} {{order.address.addressLine2}}, {{order.address.unitNo}}, {{order.address.postalCode}} {{order.address.state}} {{order.address.country}}</b-col>
                <b-col v-if="order.addressId == null">Self Pick-up</b-col>
                <b-col v-else>{{order.address.hotel.hotelName}}, {{order.address.addressLine1}} {{order.address.addressLine2}}, {{order.address.unitNo}}, {{order.address.postalCode}} {{order.address.state}} {{order.address.country}}</b-col>
                <b-col v-if="order.request == null">N/A</b-col>
                <b-col v-else>{{order.request}}</b-col>
              </b-row>
            </div>
          </div>
        </b-container>

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
import { ORDER_GET_REQUEST } from "@/store/actions/order";


export default {
  components: {
    SideBar,
    DashboardHeader
  },
  data() {
    return {

      pad: null,
      order: []
    };
  },

  methods: {
    // getOrder() {
    
    // }
  },
  mounted() {
   this.$store
        .dispatch(ORDER_GET_REQUEST)
         .then(response => {
           console.dir(response);
          this.order = response;
          console.log(response);
        })
        .catch(error => {
          console.dir(error);
          alert("error");
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
.card2 {
  padding-top: 20px;
}
</style>