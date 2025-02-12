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
                <!-- Example of tabs are Printed, Awaiting Printing, etc. -->
                <DashboardTabs
                  v-for="tab in this.Tabs"
                  v-bind:key="tab.id"
                  v-bind:title="tab.title"
                  v-bind:isDark="tab.isDark"
                  v-bind:noOfRows="tab.noOfRows"
                  @click.native="onTabChange(tab.id)"
                ></DashboardTabs>
              </ul>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

        <div cols="4">
          <Table
            v-bind:fields="this.fields"
            v-bind:items="this.sortItems"
            v-bind:headerButtonClick="this.headerButtonClick"
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:enableCheckbox="this.enableCheckbox"
            tableName="Orders"
            :imageClick="this.imageClick"
            :headerButton="this.headerButton"
            v-bind:sortBy="this.sortBy"
            v-bind:isBusy="this.isBusy"
          ></Table>
        </div>
        <!-- End of Main Content -->
      </div>
      <!-- Footer -->
      <Footer></Footer>
      <!-- End of Footer -->

      <!-- modal for when Out for Delivery orders status is updated. -->
      <b-modal
        @ok="getModalDetails"
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

      <!-- modal for when printed orders status is updated. -->
      <b-modal
        @ok="updateDeliveryman()"
        id="assignDeliveryManDialog"
        title="Assign to Deliveryman"
        ok-title="Save"
      >
        <b-row align-v="center">
          <b-col cols="4">Deliveryman</b-col>
          <b-col>
            <b-form-select v-model="selectedDeliveryMan" :options="deliveryman"></b-form-select>
          </b-col>
        </b-row>
      </b-modal>
    </div>
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
  GET_MULTIPLE_ORDERS,
  GET_ALL_STATUS,
  UPDATE_ORDER_STATUS,
  GET_PRESIGNED_URL,
  UPDATE_RECIPIENT,
  UPDATE_DELIVERYMAN
} from "@/store/actions/order";
import { GET_ALL_DELIVERYMEN } from "@/store/actions/user";
import { setInterval, clearInterval, setTimeout } from "timers";

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
      connection: null,
      //have multiple buttons

      // summary of orders contains 3 headerbuttons. Different buttons for different
      //kind of tabs.
      headerButtonClick: [
        "Update Order Status",
        "Download Images",
        "Delivery Failed"
      ],
      headerButton: [
        {
          id: 1,
          title: "Update Order Status"
        },
        {
          id: 2,
          title: "Download Images"
        },
        {
          id: 3,
          title: "Delivery Failed"
        }
      ],
      actionButtonClick: "Update One Order Status",
      imageClick: "On Order Image Click",
      noOfTabs: 0,
      enableCheckbox: true,
      selectedTab: 0,
      sortBy: "Date",
      arrayOfNumberOfRows: [],
      typesOfTabs: [],
      Tabs: [],
      presignedUrl: "",
      recipientName: null,
      userRole: null,
      ordertitle: null,
      orderIds: [],
      sortItems: [],
      updatedOrders: [],
      deliveryman: [],
      deliveryMessage: "",
      selectedDeliveryMan: null,
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
          key: "images",
          label: "Image"
        },
        {
          key: "quantity",
          label: "Qty"
        },
        {
          key: "status",
          label: "Status",
          sortable: true
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      isBusy: false
    };
  },

  computed: {},

  async mounted() {
    //get user role to show different tabs for differnt users.
    this.userRole = this.$store.getters.userRole;

    //to be shown in a modal dialog when order status
    this.getAllDeliveryMan();

    //get all status in the database to set up the tabs.
    // the status ARE the tabs.
    this.$store
      .dispatch(GET_ALL_STATUS)
      .then(response => {
        //standardize the typesOfTabs
        //set up default tabs.
        let x = 1;
        //typeoftabs are an aarray of strings that contains all the
        //status in the database.
        //first one being All.
        this.typesOfTabs[0] = "All";
        for (x; x < response.length + 1; x++)
          if (
            this.userRoleIsAllowedToSeeThisTabOrItem(response[x - 1].statusName)
          )
            this.typesOfTabs.push(response[x - 1].statusName);

        this.getAllOrders();
      })
      .catch(error => {
        this.isBusy = false;
        console.dir(error);
        this.message("danger", error);
      });

    //headerButtonClick[0] is Update Status
    eventBus.$on(this.headerButtonClick[0], orderIds => {
      var needsSignature = false;
      var needAssignDeliveryMan = false;
      var showDeliveryModal = false;

      this.items.forEach(oneItem => {
        //if at least one item is Out For Delivery, i will prompt the modal dialog.
        orderIds.forEach(oneOrderId => {
          if (oneItem.id == oneOrderId) {
            if (oneItem.status == "Out for Delivery") {
              needsSignature = true;
            } else if (oneItem.status == "Printed") {
              if (oneItem.deliveryManId == null) {
                showDeliveryModal = true;
              }
              needAssignDeliveryMan = true;
            }
          }
        });
      });

      //is successful is needed to let controller know that
      //the status is successfully uploaded.
      var isSuccessful = true;
      if (!needsSignature && !needAssignDeliveryMan) {
        this.updateStatusTabsAndTable(orderIds, isSuccessful);
      } else if (needAssignDeliveryMan) {
        this.orderIds = orderIds;
        if (showDeliveryModal) this.$bvModal.show("assignDeliveryManDialog");
        else this.updateStatusTabsAndTable(orderIds, isSuccessful);
      } else if (needsSignature) {
        this.orderIds = orderIds;
        this.ordertitle = "Multiple Orders";
        this.$bvModal.show("showSignatureDialog");
      }
    });

    //headerButtonClick[1] is Download Images
    eventBus.$on(this.headerButtonClick[1], listOfThumbNailUrl => {
      this.downloadImages(listOfThumbNailUrl);
    });

    //headerButtonClick[2] is Delivery Failed
    eventBus.$on(this.headerButtonClick[2], orderIds => {
      var isSuccessful = false;
      this.updateStatusTabsAndTable(orderIds, isSuccessful);
    });

    eventBus.$on(this.actionButtonClick, item => {
      const orderIds = [];
      orderIds.push(item.id);

      var isSuccessful = true;
      if (item.status == "Out for Delivery") {
        this.ordertitle = "Order : " + item.id;
        this.orderIds.push(item.id);
        this.$bvModal.show("showSignatureDialog");
      } else if (item.status == "Printed") {
        this.orderIds.push(item.id);
        if (item.deliveryManId == null)
          this.$bvModal.show("assignDeliveryManDialog");
        else this.updateStatusTabsAndTable(this.orderIds, isSuccessful);
      } else {
        this.updateStatusTabsAndTable(orderIds, isSuccessful);
      }
    });

    eventBus.$on(this.imageClick, thumbNailUrl => {
      //because controller only accepts a list of url
      const listOfThumbNailUrl = [];
      listOfThumbNailUrl.push(thumbNailUrl);
      this.downloadImages(listOfThumbNailUrl);
    });

    //cancelorder is called when the admin dropdown the 3 dots at the end of the row
    //and click cancel order
    eventBus.$on("cancelOrder", orderIds => {
      var isSuccessful = false;
      this.updateStatusTabsAndTable(orderIds, isSuccessful);
    });

    // Establish hub connection
    this.connection = await OrderHub.connectToOrderHub();

    // Establish hub methods
    this.connection.on("OneOrder", orderId => {
      var orderIds = [orderId];
      this.getAndUpdateMultipleOrders(orderIds);
    });

    this.connection.on("MultipleOrders", orderIds => {
      this.getAndUpdateMultipleOrders(orderIds);
    });

    this.connection.on("LowStock", optionIds => {
      this.notifyLowStock(optionIds);
    });

    // start the connection
    this.connection
      .start()
      .then(() => {})
      .catch(err => console.log(err));
  },

  beforeDestroy() {
    this.connection.stop();
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

    getAllDeliveryMan() {
      this.$store
        .dispatch(GET_ALL_DELIVERYMEN)
        .then(response => {
          this.allDeliverymen = response;
          this.deliveryman.push({
            value: null,
            text: "Please select an option"
          });
          for (var i = 0; i < this.allDeliverymen.length; i++) {
            this.deliveryman.push({
              value: response[i].email,
              text: response[i].name
            });
          }
        })
        .catch(error => {});
    },
    //is used when the order is Printed and admin tries to update
    //the status. and if the order has not been assigned a delivery person
    //the modal dialog will appear.
    updateDeliveryman() {
      for (var i = 0; i < this.allDeliverymen.length; i++) {
        if (this.allDeliverymen[i].email == this.selectedDeliveryMan) {
          const deliveryDetails = {
            deliveryManId: this.allDeliverymen[i].id,
            orderIds: this.orderIds
          };
          this.$store
            .dispatch(UPDATE_DELIVERYMAN, deliveryDetails)
            .then(response => {
              this.deliveryMessage = "Orders are assigned Delivery Man.";
              var isSuccessful = true;
              this.updateStatusTabsAndTable(this.orderIds, isSuccessful);
              this.setUpTabs();

              this.selectedDeliveryMan = null;
              this.orderIds = [];
            })
            .catch(error => {
              alert(error);
            });
        }
      }
    },
    userRoleIsAllowedToSeeThisTabOrItem(tabName) {
      if (this.userRole == "Admin") return true;
      else if (this.userRole == "Store") {
        if (tabName == "Received" || tabName == "Awaiting Printing")
          return true;
        else return false;
      }
    },

    getAllOrders() {
      this.items = [];
      this.isBusy = true;
      this.$store
        .dispatch(GET_ALL_ORDERS)
        .then(response => {
          this.isBusy = false;
          var x = 0;
          for (x; x < response.length; x++) {
            //  this.Tabs[x] = {title: typesOfTabs[x], id : x, isDark: false}
            //item: response[x].orderItems[0].options[0].product.productName,
            if (this.userRoleIsAllowedToSeeThisTabOrItem(response[x].status))
              this.items.push({
                id: response[x].orderId,
                refNo: response[x].referenceNo,
                date: new Date(
                  Date.parse(response[x].createdAt)
                ).toLocaleString("en-SG"),
                items: response[x].orderItems,
                images: response[x].orderItems,
                quantity: response[x].orderItems,
                status: response[x].status,
                actions: [this.getAction(response[x].status)],
                deliveryManId: response[x].deliveryManId
              });
          }
          //reset updatedOrders
          this.updatedOrders = [];

          //creating checkbox.
          let index;
          for (index = 0; this.items.length > index; index++)
            this.items[index].checkbox = "checkbox";

          //for counting the amount of rows in each tab.
          this.setUpTabs();
        })
        .catch(error => {
          this.isBusy = false;
          console.dir(error);
          this.message("danger", error);
        });
    },
    getAndUpdateMultipleOrders(ids) {
      this.$store
        .dispatch(GET_MULTIPLE_ORDERS, ids)
        .then(response => {
          console.log("GEt multiple orders : ", response);

          let updatedOrderList = [];
          response.forEach(updatedOrder => {
            // updatedOrderList.push({
            //   orderId: updatedOrder.orderId,
            //   statusId: updatedOrder.statusId,
            //   statusName: updatedOrder.status
            // });
            updatedOrder.statusName = updatedOrder.status;
          });

          this.highlightRows(response);
          this.updateCurrentOrders(response);
          //setUpTabs is called whenever the items are changed.
          this.setUpTabs();
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    },
    //on tab change is called when user presses a tab or when the setUpTabs is called.
    onTabChange(id) {
      //const {sortItems, items, noOfTabs, Tabs, selectedTab, typesOfTabs} = this
      //reason why i don't use const ^ is because when the data is displayed,
      //it will become read-only.
      this.sortItems = [];
      //change background color for the tab

      //will have an error if you remove this if statement.
      //because the html section will run first, then it will cause an error
      //because the tabs have not been created.
      if (this.$refs.tabs != undefined)
        this.noOfTabs = this.$refs.tabs.childElementCount;
      if (!this.Tabs[id].isDark) this.Tabs[id].isDark = true;
      this.selectedTab = id;
      var index;
      for (index = 0; index < this.Tabs.length; index++) {
        if (id != this.Tabs[index].id)
          if (this.Tabs[index].isDark) this.Tabs[index].isDark = false;
      }
      //manipulate table data after changing tab color
      let sortBy = this.typesOfTabs[id];
      for (index = 0; index < this.items.length; index++) {
        if (sortBy === this.items[index].status)
          this.sortItems.push(this.items[index]);
        if (sortBy == "All") this.sortItems.push(this.items[index]);
      }
      // if (sortBy === "All") this.sortItems = this.items;
      //to disable checkbox is All tabs are selected
      if (sortBy == "All") this.enableCheckbox = false;
      else this.enableCheckbox = true;
    },

    //setuptabs again.
    setUpTabs() {
      let x;
      let index;
      let numberOfRows = 0;
      //this array will be sent to the DashboardTabs component.
      //is it used to count how many items there are in the tab and display it.
      this.arrayOfNumberOfRows = [];
      //index is 1 so as to skip the All tab. then i push a 0 on the first
      //number of the arrayofNumberOfRows.
      this.arrayOfNumberOfRows.push(null);
      for (index = 1; index < this.typesOfTabs.length; index++) {
        numberOfRows = 0;
        for (x = 0; x < this.items.length; x++) {
          if (this.items[x].status == this.typesOfTabs[index]) numberOfRows++;
        }
        this.arrayOfNumberOfRows.push(numberOfRows);
        //set up tabs after getting all the items and what
      }
      let typesOfTabs = this.typesOfTabs;
      //set up actions based on the type of tabs
      //you can generate the actions in the previous for loop. but i feel that
      //the code will be extra messy.
      //reset tab.

      this.Tabs = [];
      for (x = 0; x < typesOfTabs.length; x++)
        //initialize the tabs to get title, id and isDark.
        //and be sent the the dashboard tab component to render.
        this.Tabs[x] = {
          title: typesOfTabs[x],
          id: x,
          isDark: false,
          noOfRows: this.arrayOfNumberOfRows[x]
        };
      //selects current tabs.
      //if no tab is selected, the default will be 0
      this.onTabChange(this.selectedTab);
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
    updateStatusTabsAndTable(orderIds, isSuccessful) {
      //isSuccessful will always be true unless the admin presses on the dropdown at the
      //end of the row and click cancel order

      const jsonData = {
        orderIds: orderIds,
        isSuccessful: isSuccessful
      };
      this.$store
        .dispatch(UPDATE_ORDER_STATUS, jsonData)
        .then(response => {
          this.message(
            "success",
            "Order Status(es) is updated successfully! " + this.deliveryMessage
          );
          this.updateCurrentOrders(response.orders);
          //reset the tabs.
          this.setUpTabs();
          this.deliveryMessage = "";
          this.orderIds = [];
          //there is a few lines in the router.js where i reset the eventbus listener too
          //do take note of that.
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    },
    //update current orders gets orders that are updated, and update the
    //current items. this only causes items that are affected to change, and
    //not the whole table.
    updateCurrentOrders(orders) {
      //update current items's statuses and actions
      let updatedOrders = orders;
      var itemsContainsUpdatedOrder = false;
      let x;
      for (x = 0; x < this.items.length; x++) {
        updatedOrders.forEach((oneUpdatedOrder, index) => {
          if (this.items[x].id == oneUpdatedOrder.orderId) {
            itemsContainsUpdatedOrder = true;
            this.items[x].status = oneUpdatedOrder.statusName;
            this.items[x].actions = [
              this.getAction(oneUpdatedOrder.statusName)
            ];
          }
        });
      }

      //if the updated orders does not contain any of the exisitng items
      //it will be pushed to the table instead, because the item does not exist.
      if (!itemsContainsUpdatedOrder) {
        updatedOrders.forEach((oneUpdatedOrder, index) => {
          var itemLength = this.items.push({
            id: oneUpdatedOrder.orderId,
            refNo: oneUpdatedOrder.referenceNo,
            date: new Date(
              Date.parse(oneUpdatedOrder.createdAt)
            ).toLocaleString(),
            items: oneUpdatedOrder.orderItems,
            images: oneUpdatedOrder.orderItems,
            quantity: oneUpdatedOrder.orderItems,
            status: oneUpdatedOrder.status,
            actions: [this.getAction(oneUpdatedOrder.status)],
            deliveryManId: oneUpdatedOrder.deliveryManId
          });
          //highlights row.
          this.$set(this.items[itemLength - 1], "_rowVariant", "primary");
        });
      }
    },

    //is used to down the images, whenever the user click on the image itself
    //or when the user selects multiple items and click on the header button.
    downloadImages(listOfThumbNailUrl) {
      this.$store
        .dispatch(GET_PRESIGNED_URL, listOfThumbNailUrl)
        .then(response => {
          let index;
          var interval = setInterval(download, 300, response.imgUrls);
          function download(urls) {
            var url = urls.pop();
            var a = document.createElement("a");

            a.setAttribute("href", url);
            a.setAttribute("download", "");
            a.setAttribute("target", "_blank");
            a.click();
            if (urls.length == 0) {
              clearInterval(interval);
            }
          }
          // this.presignedUrl = response.imgUrls[0];
          // this.$bvModal.show("viewPresignedImage");
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    },
    highlightRows(orders) {
      for (var i = 0; i < orders.length; i++) {
        for (var y = 0; y < this.items.length; y++)
          if (orders[i].orderId == this.items[y].id) {
            this.$set(this.items[y], "_rowVariant", "primary");
          }
      }
    },
    notifyLowStock(optionIds) {
      var skus = "";
      for (var i = 0; i < optionIds.length; i++) {
        skus += " '" + optionIds[i] + "'";
      }
      this.message("danger", "Low stock count for" + skus + "!");
    },
    //when items are out for delivery and admin tries to update the status
    //it will prompt the modal dialog.
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
            this.message("success", response.message);
            this.updateCurrentOrders(response.orders);
            //reset the tabs.
            this.setUpTabs();
          })
          .catch(error => {
            console.dir(error);
            this.message("danger", error);
          });
      } else {
      }

      this.recipientName = null;
      this.ordertite = null;
      this.orderIds = [];
    }
  }
};
</script>

<style>
</style>