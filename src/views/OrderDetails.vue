<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <div id="content-wrapper">
      <div id="content">
        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <DashboardHeader title="Order Details"></DashboardHeader>
          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">
            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">Valerie Luna</span>
                <img
                  class="img-profile rounded-circle"
                  src="https://source.unsplash.com/QAB-WJcbgJk/60x60"
                >
              </a>
              <!-- Dropdown - User Information -->
              <div
                class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown"
              >
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                  Activity Log
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
      <b-container fluid class="bg-white text-left" align-h="center">
      <div class="card shadow">
        <div class="card-header py-3">

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
     </div>
     
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