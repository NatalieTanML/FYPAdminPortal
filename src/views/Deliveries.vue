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
      @close="resetDetails"
      @cancel="resetDetails"
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
import OrderHub from "@/services/orderHub.js";
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardTabs from "@/components/DashboardTabs";
import Table from "@/components/Table";
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
    Table
  },
  data() {
    return {
      noOfTabs: 0,
      selectedTab: 0,
      pad: null,
      sortBy: "date",
      ordertitle: null,
      orderIds: [],
      enableCheckbox: true,

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
    resetDetails() {
      this.recipientName = null;
      this.ordertitle = null;
      this.orderids = [];
    },

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
        console.log(jsonData);

        this.$store
          .dispatch(UPDATE_RECIPIENT, jsonData)
          .then(response => {
            console.log(response);

            this.updateCurrentOrders(response.orders);
            this.message("success", "Order(s) status has been updated");
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
    highlightRows(orders) {
      for (var i = 0; i < orders.length; i++) {
        for (var y = 0; y < this.items.length; y++)
          if (orders[i].orderId == this.items[y].id)
            this.$set(this.items[y], "_rowVariant", "primary");
      }
    },
    getAddressOrHotelName(response) {
      console.log("getaddressorhotel", response);
      var addressOrHotel = null;

      if (response.address.hotel.hotelName != null)
        addressOrHotel = response.address.hotel.hotelName;
      else
        addressOrHotel =
          response.address.addressLine1 + ", " + response.address.addressLine2;
      return addressOrHotel;
    },
    getAndUpdateMultipleOrders(ids) {
      this.$store
        .dispatch(GET_MULTIPLE_ORDERS, ids)
        .then(response => {
          console.log("Get multiple orders : ", response);

          // let updatedOrderList = [];
          // response.forEach(updatedOrder => {
          //   updatedOrderList.push({
          //     orderId: updatedOrder.orderId,
          //     statusId: updatedOrder.statusId,
          //     statusName: updatedOrder.status
          //   });
          // });

          this.updateCurrentOrders(response);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    },
    updateCurrentOrders(orders) {
      console.log("updateCurrentOrders : ", orders);
      //update current items's statuses and actions
      let updatedOrders = orders;
      let x;
      for (x = 0; x < this.items.length; x++) {
        updatedOrders.forEach((oneUpdatedOrder, index) => {
          //if there are new records of orders that needs to be delivered,
          //i will populate the table, or else i will take the item out from the
          //table. this is because i use this method when i update the status from out for delivery to completed
          //of the order too.
          console.log("one updated order : ", oneUpdatedOrder);
          if (this.items[x].id == oneUpdatedOrder.orderId) {
            this.items.splice(x, 1);
          } 
        });
      }

      
      updatedOrders.forEach((oneUpdatedOrder, index) => {
      if (oneUpdatedOrder.status == "Out for Delivery") {
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
             console.log("one new updated item : ", this.items);
          }
                 });
      

      if (this.forceRender) this.forceRender = false;
      else this.forceRender = true;
    }
  },
  async mounted() {
    eventBus.$on(this.headerButtonClick[0], listOfOrderIds => {
      this.ordertitle = "Multiple Orders";
      this.orderIds = listOfOrderIds;
      this.$bvModal.show("showSignatureDialog");
    });

    eventBus.$on(this.headerButtonClick[1], listOfOrderIds => {
      var isSuccessful = false;

      const jsonData = {
        orderIds: listOfOrderIds,
        isSuccessful: isSuccessful
      };
      this.$store
        .dispatch(UPDATE_ORDER_STATUS, jsonData)
        .then(response => {
          this.message("success", "Order Status(es) is updated successfully!");
          this.updateCurrentOrders(response.orders);
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    });

    eventBus.$on(this.actionButtonClick, itemId => {
      console.log("item id " + itemId);
      this.ordertitle = "Order : " + itemId;
      this.orderIds.push(itemId);
      this.$bvModal.show("showSignatureDialog");
    });

    this.$store
      .dispatch(GET_ALL_ORDERS)
      .then(response => {
        let x;
        for (x = 0; x < response.length; x++) {
          //if order is out for delivery, only the assigned delivery man can see their own
          //deliveries. Admin can see the deliveries also.
          console.log( response[x].deliveryManId)
          console.log( this.$store.getters.userId)
          console.log(response[x].status)

          if (
            (response[x].status == "Out for Delivery" &&
              response[x].deliveryManId == this.$store.getters.userId) ||
            (this.$store.getters.userRole == "Admin" &&
              response[x].status == "Out for Delivery")
          ) {
            var addressOrHotel = this.getAddressOrHotelName(response[x]);

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

    // Establish hub connection
    this.connection = await OrderHub.connectToOrderHub();

    // Establish hub methods
    this.connection.on("OneOrder", orderId => {
      console.log("OneOrder called");
      console.log("one order id : ", orderId);

      var orderIds = [orderId];

      this.getAndUpdateMultipleOrders(orderIds);

      // this.updateCurrentOrders(updatedOrderList);
    });

    this.connection.on("MultipleOrders", orderIds => {
      console.log("MultipleOrders called");
      console.log("multiple order : ", orderIds);

      this.getAndUpdateMultipleOrders(orderIds);
    });

    // start the connection
    this.connection
      .start()
      .then(() => {
        console.log("Connection to hub started");
      })
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