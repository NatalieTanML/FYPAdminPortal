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
                    </b-row>

                    <b-row class="font-weight-bold mb-2">
                      <b-col md="4" v-if="selectedDeliveryType != 'Self Pick-up'">
                        <b-form-group label="Country">
                          <b-input v-model="country"></b-input>
                        </b-form-group>
                      </b-col>

                      <b-col md="4" v-if="selectedDeliveryType != 'Self Pick-up'">
                        <b-form-group label="State">
                          <b-input v-model="state"></b-input>
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <b-row>
                      <b-col md>
                        <b-form-group id="input-group-6">
                          <h6 class="font-weight-bold">Delivery Type:</h6>

                          <b-form-radio-group
                            id="input-6"
                            v-model="selectedDeliveryType"
                            name="type"
                            stacked
                            class="mt-2"
                          >
                            <b-form-radio
                              v-for="deliveryType in deliveryTypes"
                              v-bind:key="deliveryType.deliveryTypeId"
                              :value="deliveryType.deliveryTypeName"
                            >{{deliveryType.deliveryTypeName}}</b-form-radio>
                          </b-form-radio-group>
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <div v-if="selectedDeliveryType == 'Residential' " class="font-weight-bold">
                      <b-row class="mb-2">
                        <b-col md>
                          <b-form-group label="Postal Code">
                            <b-input v-model="residential.postalCode"></b-input>
                          </b-form-group>
                        </b-col>

                        <b-col md>
                          <b-form-group label="Address Line 1">
                            <b-input v-model="residential.addressOne"></b-input>
                          </b-form-group>
                        </b-col>

                        <b-col md>
                          <b-form-group label="Address Line 2">
                            <b-input v-model="residential.addressTwo"></b-input>
                          </b-form-group>
                        </b-col>
                      </b-row>

                      <b-row class="mb-2">
                        <b-col md="4">
                          <b-form-group label="Unit No.">
                            <b-input v-model="residential.unitNo"></b-input>
                          </b-form-group>
                        </b-col>

                        <b-col md="4">
                          <b-form-group label="Special Request">
                            <b-input v-model="specialRequest"></b-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </div>

                    <b-row v-if="selectedDeliveryType == 'Hotel' " class="font-weight-bold mb-2">
                      <b-col md>
                        <b-form-group label="Hotel">
                          <select
                            class="form-control dropdown"
                            id="exampleFormControlSelect1"
                            @change="onSelectChange($event)"
                          >
                            <option
                              v-for="oneHotel in hotels"
                              v-bind:key="oneHotel.value"
                              v-bind:selected="oneHotel.value == selectedHotel.value"
                              :value="JSON.stringify(oneHotel)"
                            >{{oneHotel.text}}</option>
                          </select>
                        </b-form-group>
                      </b-col>

                      <b-col md>
                        <b-form-group label="Room No">
                          <b-input v-model="hotel.roomNo"></b-input>
                        </b-form-group>
                      </b-col>

                      <b-col md>
                        <b-form-group label="Special Request">
                          <b-input v-model="specialRequest"></b-input>
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <b-row>
                      <b-col>
                        <b-button v-on:click="saveDetails()" variant="primary">Save</b-button>
                        <b-button
                          v-on:click="cancelButton()"
                          class="ml-3"
                          variant="secondary"
                        >Cancel</b-button>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </b-container>
            </div>
            <div v-else>
              <h4 class="m-4">Error, no order data retrieved!</h4>
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
import {
  ORDER_GET_REQUEST,
  GET_PRESIGNED_URL,
  GET_ALL_HOTELS,
  UPDATE_ORDER,
  GET_ALL_DELIVERY_TYPES
} from "@/store/actions/order";

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
      selectedDeliveryType: null,
      hotels: null,
      specialRequest: null,
      deliveryTypes: [],
      selectedHotel: {
        hotelAddress: null,
        hotelPostalCode: null,
        text: null,
        value: null
      },
      country: null,
      state: null,
      hotel: {
        id: null,
        address: null,
        postalCode: null,
        roomNo: null
      },
      residential: {
        addressOne: null,
        addressTwo: null,
        unitNo: null,
        postalCode: null
      },
      attribute: []
    };
  },

  created() {},

  methods: {
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },
    cancelButton() {
      this.$router.replace({ name: "SummaryOfOrders" });
    },
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
    },
    onSelectChange(event) {
      this.selectedHotel = JSON.parse(event.target.value);
    },
    getAction(status) {
      if (status == "Received") return "Accept Order";
      else if (status == "Awaiting Printing") return "Print";
      else if (status == "Printed") return "Deliver";
      else if (status == "Out for Delivery") return "Delivered";
      else if (status == "Completed") return null;
      else if (status == "Delivery Failed") return "Re-Deliver";
      else if (status == "Cancelled") return null;
      else return null;
    },
    getAllDeliveryTypes() {
      this.$store
        .dispatch(GET_ALL_DELIVERY_TYPES)
        .then(response => {
          this.deliveryTypes = response;
          console.log(response);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    },

    getAndSetUpOrder() {
      const orderId = localStorage.getItem("editOrderId");

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
                  this.order.orderItems[a].options.attributes[b]
                    .attributeValue + ")";
              else
                this.attribute[a] +=
                  this.order.orderItems[a].options.attributes[b]
                    .attributeValue + ",";
              atr++;
            }
          }
          this.specialRequest = response.request;
          this.country = response.address.country;
          this.state = response.address.state;

          if (response.deliveryType == "Hotel") {
            this.selectedDeliveryType = "Hotel";
            this.hotel.id = response.address.hotelId;
            this.hotel.roomNo = response.address.unitNo;
            this.hotel.address = response.address.addressLine1;

            const selectedHotelObject = {
              hotelAddress: response.address.hotel.hotelAddress,
              hotelPostalCode: response.address.postalCode,
              text: response.address.hotel.hotelAddress,
              value: response.address.hotelId
            };
            //   this.selectedHotel.hotelAddress = response.address.hotel.hotelAddress
            //   this.selectedHotel.hotelPostalCode = response.address.postalCode
            //   this.selectedHotel.text = response.address.hotel.hotelAddress
            //   this.selectedHotel.value = response.address.hotelId
            this.selectedHotel = selectedHotelObject;
          } else if (response.deliveryType == "Residential") {
            this.selectedDeliveryType = "Residential";
            this.residential.addressOne = response.address.addressLine1;
            this.residential.addressTwo = response.address.addressLine2;
            this.residential.postalCode = response.address.postalCode;
            this.residential.unitNo = response.address.unitNo;
          } else this.selectedDeliveryType = "Self Pick-up";

          this.$store
            .dispatch(GET_ALL_HOTELS)
            .then(response => {
              console.log(response);
              console.log(this.order);
              this.hotels = response;
              if (this.selectedDeliveryType == "Hotel") {
                this.hotels.forEach(oneHotel => {
                  if (
                    oneHotel.hotelAddress ==
                    this.order.address.hotel.hotelAddress
                  ) {
                    this.selectedHotel = oneHotel;
                  }
                });
              }
              //this.selectedHotel = this.hotels[0];
            })
            .catch(error => {
              console.dir(error);
              alert("error");
            });
        })
        .catch(error => {
          this.message("danger", error);
        });
    },

    saveDetails() {
      console.log(this.selectedHotel);

      if (this.selectedDeliveryType == "Hotel") {
        //jsonData is very similar to the order object.
        const jsonData = {
          Address: {
            AddressLine1: this.selectedHotel.hotelAddress,
            AddressLine2: this.selectedHotel.text,
            UnitNo: this.hotel.roomNo,
            PostalCode: this.selectedHotel.hotelPostalCode,
            HotelId: this.selectedHotel.value,
            Country: this.country,
            State: this.state
          },
          AddressId: this.order.addressId,
          OrderId: this.order.orderId,
          DeliveryTypeId: this.getDeliveryTypeId(),
          Request: this.specialRequest
        };

        this.updateOrder(jsonData);
      } else if (this.selectedDeliveryType == "Residential") {
        const jsonData = {
          Address: {
            AddressLine1: this.residential.addressOne,
            AddressLine2: this.residential.addressTwo,
            UnitNo: this.residential.unitNo,
            PostalCode: this.residential.postalCode,
            HotelId: null,
            Country: this.country,
            State: this.state
          },
          AddressId: this.order.addressId,
          OrderId: this.order.orderId,
          DeliveryTypeId: this.getDeliveryTypeId(),
          Request: this.specialRequest
        };
        this.updateOrder(jsonData);
      } else {
        const jsonData = {
          Address: {
            AddressLine1: null,
            AddressLine2: null,
            UnitNo: null,
            PostalCode: null,
            HotelId: null,
            Country: this.country,
            State: this.state
          },
          AddressId: null,
          OrderId: this.order.orderId,
          DeliveryTypeId: this.getDeliveryTypeId(),
          Request: null
        };

        this.updateOrder(jsonData);
      }
    },
    updateOrder(jsonData) {
      console.log(jsonData);
      this.$store
        .dispatch(UPDATE_ORDER, jsonData)
        .then(response => {
          console.log(response);
          this.message("success", response.message);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    },
    getDeliveryTypeId() {
      let id;
      this.deliveryTypes.forEach((element, index) => {
        if (element.deliveryTypeName == this.selectedDeliveryType)
          id = element.deliveryTypeId;
      });
      return id;
    }
  },

  mounted() {
    this.getAllDeliveryTypes();
    this.getAndSetUpOrder();
  }
};
</script>

<style>
</style>
