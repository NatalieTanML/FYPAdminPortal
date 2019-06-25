<template>
  <div id="wrapper">
    <SideBar></SideBar>
        <b-container>

    <div id="content-wrapper">
      <div id="content">
        <!-- Topbar -->
        <DashboardHeader title="Order Details"></DashboardHeader>
          <!-- Topbar Navbar -->
       
        <!-- End of Topbar -->

          <h4 class="mb-3">Order Information</h4>
          
             <b-row class="b1 mb-2">
             <b-col>Order No.</b-col>
             <b-col>Date</b-col>
             <b-col>Subtotal</b-col>
             <b-col>Status</b-col>
             </b-row>

             <b-row>
             <b-col>123456</b-col>
             <b-col>22/04/2019</b-col>
             <b-col>$50.00</b-col>
             <b-col><b-button
                type="button"
                v-on:click="onActionButtonClick"
                lg="4"
                class="w-75"
                variant="primary"
                size="sm"
              >Awating Print</b-button></b-col>
             </b-row>

             <b-row class="b2">
             <b-col cols="8">Item(s)</b-col>
             <b-col>Image Url</b-col>
             <b-col>Cost</b-col>
             <b-col>Qty</b-col>
             <b-col>Discount</b-col>
             </b-row>
             <hr class="mb-3">

             <b-row>
             <b-col cols="8">SKU0123456789</b-col>
             <b-col><a href="https://cscwjs.s3-ap-southeast-1.amazonaws.com/amazon-s3.png" target="_blank">Click here</a></b-col>
             <b-col>$20.00</b-col>
             <b-col>1</b-col>
             <b-col>NA</b-col>
             </b-row>

             <b-row>
             <b-col cols="8">SKU0123456788</b-col>
             <b-col><a href="https://cscwjs.s3-ap-southeast-1.amazonaws.com/amazon-s3.png" target="_blank">Click here</a></b-col>
             <b-col>$20.00</b-col>
             <b-col>1</b-col>
             <b-col>NA</b-col>
             </b-row>

             <b-row class="mb-3">
             <b-col cols="8">SKU0123456787</b-col>
             <b-col><a href="https://cscwjs.s3-ap-southeast-1.amazonaws.com/amazon-s3.png" target="_blank">Click here</a></b-col>
             <b-col>$10.00</b-col>
             <b-col>1</b-col>
             <b-col>NA</b-col>
             </b-row>

             <hr class="mb-3">

             <b-row>
             <b-col  cols="8"></b-col>
             <b-col></b-col>
             <b-col class="total">Total :</b-col>
             <b-col class="total">$50.00</b-col>
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
             <b-col>NA</b-col>
             <b-col>11-502 8 Sentosa Gateway, Singapore 098269</b-col>
             <b-col>11-502 8 Sentosa Gateway, Singapore 098269</b-col>
             <b-col>NA</b-col>
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
   
     
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";


export default {
  components: {
    SideBar,
    DashboardHeader,

  },
  data() {
    return {
      noOfTabs: 0,
      selectedTab: 0,
      pad: null,


      
    };
  },

  methods: {
    
    
  },
  mounted() {
    
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
  .card2 {
     padding-top: 20px;
  }

</style>