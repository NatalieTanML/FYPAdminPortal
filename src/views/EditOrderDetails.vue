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
                  <b-col class="b3" v-if="getAction(order.status) != null">Actions</b-col>
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
                      v-if="getAction(order.status) != null"
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
                     style="height: 100px; max-height: 150px; cursor:pointer;"
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
                  </b-row>
                  
                  <b-row class=" mb-2">
                  <b-col v-if="order.emailString == null">N/A</b-col>
                  <b-col v-else>{{order.emailString}}</b-col>
                  </b-row>

                  <b-row class="b1 mb-2">

                  <b-col cols="4" v-if="selectedDeliveryType != 'Self Pick-up'">
                <b-form-group label="Country">
                 <b-input v-model="country"></b-input>
                </b-form-group>
                </b-col>

                <b-col cols="4" v-if="selectedDeliveryType != 'Self Pick-up'">
                <b-form-group label="State">
                 <b-input v-model="state"></b-input>
                </b-form-group>
                </b-col>
                  </b-row>

                  

                      <b-form-group  id="input-group-6">
                          <span  class="b1">Delivery Type : </span>
                          
                    <b-form-radio-group
                      id="input-6"
                      v-model="selectedDeliveryType"
                      name="type"
                      stacked
                      style="margin-top: 5px"
                    >
                    <b-form-radio v-for="deliveryType in deliveryTypes"
                    v-bind:key="deliveryType.deliveryTypeId"
                    :value="deliveryType.deliveryTypeName" >
                        {{deliveryType.deliveryTypeName}} 
                    </b-form-radio>
                   
                    </b-form-radio-group>
                  </b-form-group>
         
         <div v-if="selectedDeliveryType == 'Residential' ">
                <b-row  class="b1 mb-2">

                <b-col cols="4">
                <b-form-group label="Postal Code">
                 <b-input v-model="residential.postalCode"></b-input>
                </b-form-group>
                      </b-col>

                <b-col cols="4">
                <b-form-group label="Address Line 1">
                 <b-input v-model="residential.addressOne"></b-input>
                </b-form-group>
                </b-col>

                <b-col cols="4">
                <b-form-group label="Address Line 2">
                 <b-input v-model="residential.addressTwo"></b-input>
                </b-form-group>
                </b-col>

                </b-row>

                <b-row  class="b1 mb-2">
           
                <b-col cols="4">
                <b-form-group label="Unit No.">
                 <b-input v-model="residential.unitNo"></b-input>
                </b-form-group>
                      </b-col>

                <b-col cols="4">
                <b-form-group label="Special Request">
                 <b-input v-model="specialRequest"></b-input>
                </b-form-group>
                </b-col>

              

                </b-row>
            </div>

                <b-row v-if="selectedDeliveryType == 'Hotel' " class="b1 mb-2">
                    <b-col cols="4">
                <b-form-group label="Hotel">
                  <select
                        class="form-control dropdown"
                        id="exampleFormControlSelect1"
                        @change="onSelectChange($event)"
                      >
                        <option
                        v-if=""
                          v-for="oneHotel in hotels"
                         v-bind:key="oneHotel.value"
                         v-bind:selected="oneHotel.value == selectedHotel.value"
                          :value="JSON.stringify(oneHotel)"
                        >{{oneHotel.text}}</option>
                      </select>
                </b-form-group>
                      </b-col>

                <b-col cols="4">
                <b-form-group label="Room No">
                 <b-input v-model="hotel.roomNo"></b-input>
                </b-form-group>
                </b-col>

                <b-col cols="4">
                <b-form-group label="Special Request">
                 <b-input v-model="specialRequest"></b-input>
                </b-form-group>
                </b-col>
                </b-row>
            
                <b-row >
                <b-col>
                <b-button v-on:click="saveDetails()" variant="primary">Save</b-button>
              
                <b-button style="margin-left:1em" variant="secondary">Cancel</b-button>
                </b-col>
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
import { ORDER_GET_REQUEST,
         GET_PRESIGNED_URL,
         GET_ALL_HOTELS,
         UPDATE_ORDER,
         GET_ALL_DELIVERY_TYPES } from "@/store/actions/order";

export default {
  components: {
    SideBar,
    DashboardHeader
  },
  data() {
    return {
      pad: null,
      order: null,
      time: "",
      selectedDeliveryType: null,
      hotels: null,
      specialRequest: null,
      deliveryTypes: [],
      selectedHotel: {
          hotelAddress : null,
      hotelPostalCode : null,
      text : null,
      value : null

      },
      country: null,
      state: null,
      hotel:{
          id: null,
          address:null,
          postalCode:null,
          roomNo : null,
      },
      residential:{
          addressOne:null,
          addressTwo:null,
          unitNo:null,
          postalCode:null,
      },
     
    };
  },

  created(){
      
  },

  methods: {
         message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },
    
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
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });

    },
    onSelectChange(event){
        this.selectedHotel = JSON.parse(event.target.value)
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
      getAllDeliveryTypes(){
 this.$store
      .dispatch(GET_ALL_DELIVERY_TYPES)
      .then(response => {
        this.deliveryTypes = response;
        console.log(response)
       
         })
        .catch(error => {
          console.dir(error);
        this.message("danger", error);
        });
      },
  
        getAndSetUpOrder(){
        const orderId = localStorage.getItem("editOrderId");

         this.$store
      .dispatch(ORDER_GET_REQUEST, orderId)
      .then(response => {
        this.order = response;

         this.specialRequest = response.request
         this.country = response.address.country
         this.state = response.address.state

      if(response.address.hotelId != null){
      this.selectedDeliveryType = "Hotel"
      this.hotel.id = response.address.hotelId
      this.hotel.roomNo = response.address.unitNo
      this.hotel.address = response.address.addressLine1

        const selectedHotelObject = {
            "hotelAddress" : response.address.hotel.hotelAddress,
            "hotelPostalCode" : response.address.postalCode,
            "text" : response.address.hotel.hotelAddress,
            "value" : response.address.hotelId
        }
    //   this.selectedHotel.hotelAddress = response.address.hotel.hotelAddress
    //   this.selectedHotel.hotelPostalCode = response.address.postalCode
    //   this.selectedHotel.text = response.address.hotel.hotelAddress
    //   this.selectedHotel.value = response.address.hotelId
    this.selectedHotel = selectedHotelObject;
      }
      else if(response.address.addressLine1 != null){
      this.selectedDeliveryType = "Residential"
      this.residential.addressOne = response.address.addressLine1
      this.residential.addressTwo = response.address.addressLine2
      this.residential.postalCode = response.address.postalCode
      this.residential.unitNo = response.address.unitNo
      }
      else
      this.selectedDeliveryType = "Self Pick-up"

      this.$store
        .dispatch(GET_ALL_HOTELS)
        .then(response => {
            console.log(response)
          this.hotels = response;
          this.selectedHotel = this.hotels[0]
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

        saveDetails(){
          console.log(this.selectedHotel)
          

            if(this.selectedDeliveryType == "Hotel"){
                //jsonData is very similar to the order object.
            const jsonData ={
                "Address":{
                   "AddressLine1": this.selectedHotel.hotelAddress,
                    "UnitNo": this.hotel.roomNo,
                    "PostalCode": this.selectedHotel.hotelPostalCode,
                    "HotelId": this.selectedHotel.value,
                    "Country": this.country,
                    "State": this.state

                },
                "AddressId" : this.order.addressId,
                "OrderId": this.order.orderId,
                "DeliveryTypeId": this.getDeliveryTypeId(),
                "Request": this.specialRequest

            }

           

            this.updateOrder(jsonData);

            }
            else if(this.selectedDeliveryType == "Residential"){
                 

           const jsonData ={
                "Address":{
                    "AddressLine1": this.residential.addressOne,
                   "AddressLine2": this.residential.addressTwo,
                    "UnitNo": this.residential.unitNo,
                    "PostalCode": this.residential.postalCode,
                    "HotelId": null,
                    "Country": this.country,
                    "State": this.state

                },
                "AddressId" : this.order.addressId,
                "OrderId": this.order.orderId,
                "DeliveryTypeId": this.getDeliveryTypeId(),
                "Request": this.specialRequest

            }
              this.updateOrder(jsonData);

            }
            else{
                
           const jsonData ={
                "Address":{
                    "AddressLine1": null,
                   "AddressLine2": null,
                    "UnitNo": null,
                    "PostalCode": null,
                    "HotelId": null,
                    "Country": this.country,
                    "State": this.state

                },
                "AddressId" : null,
                "OrderId": this.order.orderId,
                "DeliveryTypeId": this.getDeliveryTypeId(),
                "Request": null

            }

              this.updateOrder(jsonData);
            }

        
       
        },
        updateOrder(jsonData){
            console.log(jsonData)
              this.$store
        .dispatch(UPDATE_ORDER, jsonData)
        .then(response => {
            console.log(response);
            this.message("success", "Order Details is updated!");
              })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
        },
        getDeliveryTypeId(){
            let id;
            this.deliveryTypes
            .forEach((element, index) => {
                if(element.deliveryTypeName == this.selectedDeliveryType)
                id = element.deliveryTypeId
            });
        return id;
        }

  },

  mounted() {
      this.getAllDeliveryTypes();
   this.getAndSetUpOrder()

    
   
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
