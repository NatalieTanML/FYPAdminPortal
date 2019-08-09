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
          <div class="card shadow mb-4">
            <!-- User Interface controls -->
            <div class="card-header py-3">
              <b-row>
                <b-col>
                  <h4>Order Details</h4>
                </b-col>
                <b-col>
                  <div v-if="this.$store.getters.userRole == 'Admin'">
                    <b-button variant="primary" class="float-right" @click="editOrder">Edit Order</b-button>
                  </div>
                </b-col>
              </b-row>
            </div>
            <!-- Main Content -->
            <div v-if="order != null">
              <b-container fluid class="text-left card-body" align-h="center">
                <b-row class="mb-3">
                  <b-col md="3">
                    <h6 class="font-weight-bold">Order ID</h6>
                    <p>{{order.orderId}}</p>
                  </b-col>
                  <b-col lg>
                    <h6 class="font-weight-bold">Reference No.</h6>
                    <p>{{order.referenceNo}}</p>
                  </b-col>
                  <b-col md="3">
                    <h6 class="font-weight-bold">Status</h6>
                    <p>{{order.status}}</p>
                  </b-col>
                </b-row>

                <b-row class="my-3">
                  <b-col md>
                    <h6 class="font-weight-bold">Created At</h6>
                    <p>{{new Date(Date.parse(order.createdAt)).toLocaleString("en-SG")}}</p>
                  </b-col>
                  <b-col md>
                    <h6 class="font-weight-bold">Updated At</h6>
                    <p>{{new Date(Date.parse(order.updatedAt)).toLocaleString("en-SG")}}</p>
                  </b-col>
                  <b-col md>
                    <h6 class="font-weight-bold">Updated By</h6>
                    <p v-if="order.updatedBy == null">N/A</p>
                    <p v-else>{{order.updatedBy}}</p>
                  </b-col>
                  <b-col md>
                    <h6 class="font-weight-bold">Delivered By</h6>
                    <p v-if="order.deliveryMan.name == null">Unassigned</p>
                    <p v-else>{{order.deliveryMan.name}}</p>
                  </b-col>
                </b-row>

                <b-row v-if="this.order.status == 'Completed'" class="my-3">
                  <b-col md="3">
                    <h6 class="font-weight-bold">Received By</h6>
                    <p>{{order.orderRecipient.receivedBy}}</p>
                  </b-col>
                  <b-col md>
                    <h6 class="font-weight-bold">Recipient Signature</h6>
                    <img
                      :src="'data:image/png;base64,'+this.order.orderRecipient.recipientSignature"
                      class="img-fluid"
                    />
                  </b-col>
                </b-row>

                <div>
                  <b-row class="font-weight-bold">
                    <b-col>Item(s)</b-col>
                    <b-col>Image</b-col>
                    <b-col cols="3">Qty</b-col>
                  </b-row>

                  <hr class="mb-3" />

                  <b-row
                    style="height: 150px;"
                    v-for="(orderItem,index) in order.orderItems"
                    v-bind:key="orderItem.orderId"
                  >
                    <b-col>{{orderItem.options.product.productName}}{{attribute[index]}} {{orderItem.options.skuNumber}}</b-col>
                    <b-col>
                      <img
                        @click="onImageClick(orderItem.orderImageKey)"
                        class="img-fluid"
                        style="cursor:pointer;"
                        v-bind:src="orderItem.orderImageUrl"
                      />
                    </b-col>
                    <b-col cols="3">{{orderItem.quantity}}</b-col>
                  </b-row>

                  <hr class="mb-3" />

                  <b-row class="mb-3">
                    <b-col lg="9"></b-col>
                    <b-col lg>
                      <h6 class="font-weight-bold">Subtotal:</h6>
                    </b-col>
                    <b-col lg>
                      <span class="text-right">{{ order.orderSubtotal | currency}}</span>
                    </b-col>
                  </b-row>

                  <b-row>
                    <b-col lg="9"></b-col>
                    <b-col lg>
                      <h6 class="font-weight-bold">Total:</h6>
                    </b-col>
                    <b-col lg>
                      <span class="text-right">{{ order.orderTotal | currency}}</span>
                    </b-col>
                  </b-row>
                </div>
              </b-container>

              <b-container fluid class="mt-3 text-left" align-h="center">
                <div class="card mb-4">
                  <div class="card-body py-3">
                    <h4 class="mb-3">Customer Information</h4>

                    <b-row>
                      <b-col lg>
                        <h6 class="font-weight-bold">Email Address</h6>
                        <p v-if="order.emailString == null">N/A</p>
                        <p v-else>{{order.emailString}}</p>
                      </b-col>
                      <b-col lg>
                        <h6 class="font-weight-bold">Shipping Address</h6>
                        <p v-if="order.addressId == null">Self Pickup</p>
                        <p v-else-if="order.deliveryTypeId == 1">
                          {{order.address.hotel.hotelName}}
                          <br />
                          Unit {{order.address.unitNo}}
                          <br />
                          {{order.address.country}}, {{order.address.state}}
                          <br />
                          {{order.address.postalCode}}
                        </p>
                        <p v-else-if="order.deliveryTypeId == 2">
                          {{order.address.addressLine1}}
                          <br />
                          <span v-if="order.address.addressLine2" class="my-0">
                            {{order.address.addressLine2}}
                            <br />
                          </span>
                          {{order.address.unitNo}}
                          <br />
                          {{order.address.country}}, {{order.address.state}}
                          <br />
                          {{order.address.postalCode}}
                        </p>
                      </b-col>
                      <b-col lg>
                        <h6 class="font-weight-bold">Special Request</h6>
                        <p v-if="order.request == null" class="mb-0">N/A</p>
                        <p v-else class="mb-0">{{order.request}}</p>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </b-container>
            </div>
            <div v-else>
              <h4 class="m-4">Error - No order data retrived!</h4>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { ORDER_GET_REQUEST, GET_PRESIGNED_URL } from "@/store/actions/order";

export default {
  components: {
    SideBar,
    DashboardHeader,
    Footer
  },
  data() {
    return {
      pad: null,
      order: null,
      attribute: []
    };
  },

  methods: {
    //if the admin clicks on the edit button at the top right.
    editOrder() {
      const orderId = localStorage.getItem("viewOrderId");
      localStorage.setItem("editOrderId", orderId);
      this.$router.replace({ name: "EditOrderDetails" });
    },
    //if admin clicks on the image, it will be downloaded to their computer.
    onImageClick(thumbNailUrl) {
      console.log(thumbNailUrl);
      var listOfThumbNailUrl = [];
      listOfThumbNailUrl.push(thumbNailUrl);
      this.$store
        .dispatch(GET_PRESIGNED_URL, listOfThumbNailUrl)
        .then(response => {
          console.log(response);
          let index;

          var interval = setInterval(download, 300, response.imgUrls);

          function download(urls) {
            var url = urls.pop();
            console.log(url);
            var a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("download", "");
            a.setAttribute("target", "_blank");
            a.click();

            if (urls.length == 0) {
              clearInterval(interval);
            }
          }
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    }
  },
  mounted() {
    const orderId = localStorage.getItem("viewOrderId");

    //get order using order id.
    this.$store
      .dispatch(ORDER_GET_REQUEST, orderId)
      .then(response => {
        this.order = response;
        for (var a = 0; a < this.order.orderItems.length; a++) {
          var atr = 1;
          this.attribute[a] = " (";
          for (
            var b = 0;
            b < this.order.orderItems[a].options.attributes.length;
            b++
          ) {
            if (atr == this.order.orderItems[a].options.attributes.length)
              this.attribute[a] +=
                this.order.orderItems[a].options.attributes[b].attributeValue +
                ")";
            else
              this.attribute[a] +=
                this.order.orderItems[a].options.attributes[b].attributeValue +
                ",";
            atr++;
          }
        }
      })
      .catch(error => {
        alert("error", error.response.data.message);
      });
  }
};
</script>

<style>
</style>
