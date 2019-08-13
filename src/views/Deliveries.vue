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
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:headerButtonClick="this.headerButtonClick"
            v-bind:enableCheckbox="this.enableCheckbox"
            :headerButton="this.headerButton"
            tableName="Deliveries"
            v-bind:fields="this.fields"
            v-bind:items="this.items"
            v-bind:sortBy="this.sortBy"
            v-bind:isBusy="this.isBusy"
          ></Table>
        </div>
        <!-- End of Main Content -->
      </div>
      <!-- Footer -->
      <Footer></Footer>
      <!-- End of Footer -->
    </div>
    <b-modal
      @ok="getModalDetails"
      @close="resetDetails"
      @cancel="resetDetails"
      ref="showSignatureDialog"
      id="showSignatureDialog"
      :title="this.ordertitle"
    >
      <b-form-group label="Received By">
        <b-form-input v-model="recipientName"></b-form-input>
      </b-form-group>
      <b-form-group label="Recipient's Signature">
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
import OrderHub from "@/services/orderHub.js";
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardTabs from "@/components/DashboardTabs";
import Table from "@/components/Table";
import Footer from "@/components/Footer";
import { eventBus } from "@/eventBus";
import {
  GET_ALL_ORDERS,
  UPDATE_RECIPIENT,
  UPDATE_ORDER_STATUS,
  GET_MULTIPLE_ORDERS
} from "@/store/actions/order";

export default {
  components: {
    SideBar,
    DashboardHeader,
    DashboardTabs,
    Table,
    Footer
  },
  data() {
    return {
      pad: null,
      sortBy: "date",
      ordertitle: null,
      orderIds: [],
      enableCheckbox: true,
      isBusy: false,

      // headerbutton is the button at the top right of the table
      //headerbuttonclick will be used to determine which button was clicked.
      headerButtonClick: ["Update Order Status", "Delivery Failed"],
      headerButton: [
        {
          id: 1,
          title: "Update Order Status"
        },
        {
          id: 2,
          title: "Delivery Failed"
        }
      ],

      actionButtonClick: "Delivery Signature",
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
    //resets the modal dialog details
    resetDetails() {
      this.recipientName = null;
      this.ordertitle = null;
      this.orderids = [];
    },

    //get modal details to be saved in the database.
    getModalDetails() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      if (!isEmpty) {
        const base64 = data.substring(22);

        const jsonData = {
          orderIds: this.orderIds,
          recipient: {
            ReceivedBy: this.recipientName,
            RecipientSignature: base64
          }
        };

        this.$store
          .dispatch(UPDATE_RECIPIENT, jsonData)
          .then(response => {
            this.updateCurrentOrders(response.orders);
            this.message("success", response.message);
            this.recipientName = null;
            this.ordertitle = null;
            this.orderids = [];
          })
          .catch(error => {
            console.dir(error);
            this.message("danger", error);
          });
      }
    },

    //check whether the order is to be delivered to hotel or an address.
    getAddressOrHotelName(response) {
      var addressOrHotel = null;

      if (response.address.hotel.hotelName != null)
        addressOrHotel = response.address.hotel.hotelName;
      else
        addressOrHotel =
          response.address.addressLine1 + ", " + response.address.addressLine2;

      if (
        response.address.addressLine1 == null ||
        response.address.addressLine1 == ""
      )
        addressOrHotel = "Self Pick-up";

      return addressOrHotel;
    },

    //when multiple orders are updated, this method will be used to update the table.
    getAndUpdateMultipleOrders(ids) {
      this.isBusy = true;
      this.$store
        .dispatch(GET_MULTIPLE_ORDERS, ids)
        .then(response => {
          this.isBusy = false;
          this.updateCurrentOrders(response);
        })
        .catch(error => {
          this.isBusy = false;
          console.dir(error);
          this.message("danger", error);
        });
    },

    //update current orders if there is a change in database records.
    updateCurrentOrders(orders) {
      //update current items's statuses and actions
      let updatedOrders = orders;
      let x;

      for (x = 0; x < this.items.length; x++) {
        updatedOrders.forEach((oneUpdatedOrder, index) => {
          //if there are new records of orders that needs to be delivered,
          //i will populate the table, or else i will take the item out from the
          //table. this is because i use this method when i update the status from out for delivery to completed
          //of the order too.
          if (this.items[x].id == oneUpdatedOrder.orderId) {
            this.items.splice(x, 1);
          }
        });
      }

      //if there are new orders, it will be pushed to the table instead of updating
      //current records.
      updatedOrders.forEach((oneUpdatedOrder, index) => {
        if (
          oneUpdatedOrder.status == "Out for Delivery" &&
          oneUpdatedOrder.deliveryManId == this.$store.getters.userId
        ) {
          var itemLength = this.items.push({
            id: oneUpdatedOrder.orderId,
            refNo: oneUpdatedOrder.referenceNo,
            date: new Date(
              Date.parse(oneUpdatedOrder.createdAt)
            ).toLocaleString(),
            items: oneUpdatedOrder.orderItems,
            address: this.getAddressOrHotelName(oneUpdatedOrder),
            actions: ["Delivered"]
          });

          this.$set(this.items[itemLength - 1], "_rowVariant", "primary");
        }
      });
    }
  },
  async mounted() {
    //headerButtonClick[0] is when the first header button is clicked.
    //in this case, it is the Update Order Status button
    eventBus.$on(this.headerButtonClick[0], listOfOrderIds => {
      this.ordertitle = "Multiple Orders";
      this.orderIds = listOfOrderIds;
      this.$bvModal.show("showSignatureDialog");
    });

    //headerButtonClick[0] is when the first header button is clicked.
    //in this case, it is the Delivery Failed button
    eventBus.$on(this.headerButtonClick[1], listOfOrderIds => {
      var isSuccessful = false;
      //isSuccessful is false because delivery failed

      const jsonData = {
        orderIds: listOfOrderIds,
        isSuccessful: isSuccessful
      };
      this.$store
        .dispatch(UPDATE_ORDER_STATUS, jsonData)
        .then(response => {
          this.message("success", response.message);

          this.updateCurrentOrders(response.orders);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    });

    eventBus.$on(this.actionButtonClick, itemId => {
      this.ordertitle = "Order : " + itemId;
      this.orderIds.push(itemId);
      this.$bvModal.show("showSignatureDialog");
    });

    //get all orders to be displated in the table.
    this.$store
      .dispatch(GET_ALL_ORDERS)
      .then(response => {
        let x;
        for (x = 0; x < response.length; x++) {
          console.log(response[x]);
          //if order is out for delivery, only the assigned delivery man can see their own
          //deliveries. Admin can see the deliveries also.
          if (
            (response[x].deliveryType != "Self Pick-up" &&
              (response[x].status == "Out for Delivery" &&
                response[x].deliveryManId == this.$store.getters.userId)) ||
            (this.$store.getters.userRole == "Admin" &&
              response[x].status == "Out for Delivery" &&
              response[x].deliveryType != "Self Pick-up")
          ) {
            var addressOrHotel = this.getAddressOrHotelName(response[x]);

            this.items.push({
              id: response[x].orderId,
              refNo: response[x].referenceNo,
              date: new Date(Date.parse(response[x].createdAt)).toLocaleString(
                "en-SG"
              ),
              items: response[x].orderItems,
              address: addressOrHotel,
              actions: ["Delivered"]
            });
          }
        }
      })
      .catch(error => {
        console.dir(error);
        this.message("danger", error);
      });

    // Establish hub connection
    this.connection = await OrderHub.connectToOrderHub();

    // Establish hub methods
    this.connection.on("OneOrder", orderId => {
      var orderIds = [orderId];

      this.getAndUpdateMultipleOrders(orderIds);

      // this.updateCurrentOrders(updatedOrderList);
    });

    this.connection.on("MultipleOrders", orderIds => {
      this.getAndUpdateMultipleOrders(orderIds);
    });

    // start the connection
    this.connection
      .start()
      .then(() => {})
      .catch(err => console.log(err));
  },

  async beforeDestroy() {
    this.connection.stop();
  }
};
</script>

<style>
.pad {
  border: 2px solid #cbc9c6;
  border-radius: 5px;
}
</style>