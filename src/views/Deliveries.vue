<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->

        <DashboardHeader title="Deliveries"></DashboardHeader>
        <!-- Topbar Navbar -->

        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div cols="4">
          <Table v-bind:actionButtonClick="this.actionButtonClick" v-bind:fields="this.fields"
            v-bind:items="this.items"></Table>
        </div>
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
    <b-modal ref="showSignatureDialog" id="showSignatureDialog" title="Confirm Delivery - Order 12345">
      <b-form-group label="Received By">
        <b-form-input></b-form-input>
      </b-form-group>
      <b-form-group label="Receipient's Signature">
        <VueSignaturePad :options="{onBegin: () => {$refs.signaturePad.resizeCanvas()}}" class="pad" width="100%"
          height="200px" ref="signaturePad" />
      </b-form-group>
    </b-modal>
  </div>

  <!-- End of Content Wrapper -->
</template>

<script>
  import SideBar from "@/components/SideBar";
  import DashboardHeader from "@/components/DashboardHeader";
  import DashboardTabs from "@/components/DashboardTabs";
  import Table from "@/components/Table";
  import {
    eventBus
  } from "@/eventBus";
  import {
    GET_ALL_ORDERS,
  } from "@/store/actions/order";

  export default {
    components: {
      SideBar,
      DashboardHeader,
      DashboardTabs,
      Table
    },
    data() {
      return {
        noOfTabs: 0,
        selectedTab: 0,
        pad: null,
        sortBy: '',
        actionButtonClick: "Delivery Signature",

        items: [{}],
        fields: [{
            key: "refNo",
            label: "Ref. No",
            sortable: true
          },
          {
            key: "date",
            label: "Date",
            sortable: true
          },
          {
            key: "items",
            label: "Item",
            sortable: true
          },
          {
            key: "address",
            label: "Address",
            sortable: true
          },
          {
            key: "actions",
            label: "Actions"
          }
        ]
      };
    },

    methods: {

    },
    mounted() {
      eventBus.$on(this.actionButtonClick, () => {
        this.$bvModal.show("showSignatureDialog");


      });

      this.$store
        .dispatch(GET_ALL_ORDERS)
        .then(response => {
          let x;
          for (x = 0; x < response.length; x++) {
            //  this.Tabs[x] = {title: typesOfTabs[x], id : x, isDark: false}
            //item: response[x].orderItems[0].options[0].product.productName,

            this.items[x] = {
              id: response[x].orderId,
              refNo: response[x].referenceNo,
              date: (response[x].createdAt),
              items: response[x].orderItems,
              // address: response[x].address,
              actions: "Delivered",


            }
          }


        })
        .catch(error => {

          console.dir(error);
          this.message("danger", error);
        });
      console.log(this.items)
    },

  };
</script>

<style>
  .pad {
    border: 2px solid #cbc9c6;
    border-radius: 5px;
  }
</style>