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
          <Table
            :key="this.forceRender"
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:headerButtonClick="this.headerButtonClick"
            v-bind:enableCheckbox="this.enableCheckbox"
            :headerButton="this.headerButton"
            tableName="Deliveries"
            v-bind:fields="this.fields"
            v-bind:items="this.items"
            v-bind:sortBy="this.sortBy"
          ></Table>
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
    <b-modal
      @ok="getModalDetails"
      ref="showSignatureDialog"
      id="showSignatureDialog"
      :title="this.ordertitle"
    >
      <b-form-group label="Received By">
        <b-form-input v-model="recipientName"></b-form-input>
      </b-form-group>
      <b-form-group label="recipient's Signature">
        <VueSignaturePad
          :options="{onBegin: () => {$refs.signaturePad.resizeCanvas()}}"
          class="pad"
          width="100%"
          height="200px"
          ref="signaturePad"
        />
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
import { eventBus } from "@/eventBus";
import { GET_ALL_ORDERS, UPDATE_RECIPIENT } from "@/store/actions/order";

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
      sortBy: "date",
      ordertitle: null,
      orderId: null,
      enableCheckbox : true,

      headerButtonClick: ["Update Order Status"],
      headerButton: [
        {
          id: 1,
          title: "Update Order Status"
        },
      ],
      actionButtonClick: "Delivery Signature",
      forceRender: false,
      recipientName: null,
      items: [],
      fields: [
         {
           key: "checkbox",
          label: ""
        },
        {
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
    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
      // this.$snack[method](config)
    },

    getModalDetails() {
      console.log(this.recipientName);

      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      if (!isEmpty) {
        const base64 = data.substring(22);
        console.log(base64);

        const jsonData = {
          orderIds: [this.orderId],
          recipient: {
            ReceivedBy: this.recipientName,
            RecipientSignature: base64
          }
        };
        console.log(jsonData);

        this.$store
          .dispatch(UPDATE_RECIPIENT, jsonData)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.dir(error);
            this.message("danger", error);
          });
      }

      this.recipientName = null;
      this.ordertite = null;
      this.orderId = null;
    }
  },
  mounted() {
    eventBus.$on(this.actionButtonClick, itemId => {
      this.ordertitle = "Order : " + itemId;
      this.orderId = itemId;
      this.$bvModal.show("showSignatureDialog");
    });

    this.$store
      .dispatch(GET_ALL_ORDERS)
      .then(response => {
        let x;
        for (x = 0; x < response.length; x++) {
          if (response[x].status == "Out for Delivery") {
            var addressOrHotel = null;

            if (response[x].address.hotel.hotelName != null)
              addressOrHotel = response[x].address.hotel.hotelName;
            else
              addressOrHotel =
                response[x].address.addressLine1 +
                ", " +
                response[x].address.addressLine2;

            this.items.push({
              id: response[x].orderId,
              refNo: response[x].referenceNo,
              date: new Date(
                Date.parse(response[x].createdAt)
              ).toLocaleString(),
              items: response[x].orderItems,
              address: addressOrHotel,
              actions: ["Delivered"]
            });
          }
        }
        if (this.forceRender) this.forceRender = false;
        else this.forceRender = true;
      })
      .catch(error => {
        console.dir(error);
        this.message("danger", error);
      });
  }
};
</script>

<style>
.pad {
  border: 2px solid #cbc9c6;
  border-radius: 5px;
}
</style>