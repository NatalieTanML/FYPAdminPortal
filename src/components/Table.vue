<template>
  <div>
    <b-container fluid>
      <div class="card shadow mb-4">
        <!-- User Interface controls -->
        <div class="card-header py-3">
          <b-row>
            <b-col class="col-12 col-md-4">
              <b-input-group class="input-group">
                <b-form-input
                  type="text"
                  class="form-control border-0"
                  v-model="filter"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append class="input-group-append">
                  <b-button variant="primary">
                    <i class="fas fa-search fa-sm"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col>
              <div v-for="oneHeaderButton in this.headerButton" v-bind:key="oneHeaderButton.id">
                <b-button
                  v-on:click="onHeaderButtonClick(oneHeaderButton.title)"
                  variant="primary"
                  style="margin-left: 1em"
                  class="float-right"
                  v-if="(tableName != 'Orders' && tableName != 'Deliveries' && tableName != 'Delivery Routes' && tableName != 'Resource Management' ) ||
                (tableName == 'Orders' &&(checkedCheckBox.length != 0 &&(showHeaderButton && oneHeaderButton.title == 'Update Order Status') )) ||
                (tableName == 'Orders' &&(checkedCheckBox.length != 0 &&(showDownloadImageButton && oneHeaderButton.title=='Download Images') )) ||
                (tableName == 'Orders' &&(checkedCheckBox.length != 0 &&(showDeliveryFailedButton && oneHeaderButton.title=='Delivery Failed') )) ||
                (tableName == 'Delivery Routes' &&(checkedCheckBox.length != 0))||
                (tableName == 'Deliveries' && (checkedCheckBox.length != 0 && (oneHeaderButton.title=='Update Order Status' || oneHeaderButton.title == 'Delivery Failed')))||
                (tableName == 'Resource Management' && userRole == 'Admin')"
                >{{oneHeaderButton.title}}</b-button>
                <!-- whenever i set up a headerbutton for a new table, i will need to include a table name
                and make sure the tableName!= 'NewTable'. Then for each table, i can manually control how and when the 
                headerbutton will appear.
                
                checkCheckBox is just an array that contains the item id that are selected.
                -->
              </div>
            </b-col>
          </b-row>
        </div>

        <!-- Main table element -->
        <div class="card-body">
          <b-table
            show-empty
            responsive
            :items="items"
            :fields="fields"
            :busy="isBusy"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @row-clicked="myRowClickHandler"
            @row-hovered="myRowHoverHandler"
            @sort-changed="sortChanged"
            @filtered="onFiltered"
            :bordered="false"
            hover
          >
            <div slot="table-busy" class="text-center text-danger my-3">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="ml-3">Loading...</strong>
            </div>

            <!-- checks all the check box IF the enableCheckBox is true. -->
            <template v-if="enableCheckbox" slot="HEAD_checkbox">
              <b-form-checkbox @change="checkAllCheckBox()" v-model="checkAll"></b-form-checkbox>
            </template>

            <template v-if="enableCheckbox" slot="checkbox" slot-scope="row">
              <b-form-checkbox
                :checked="checkedCheckBox.includes(row.item.id)"
                @change="onCheckBoxCheck(row.item)"
              ></b-form-checkbox>
            </template>

            <template slot="actions" slot-scope="row">
              <b-row>
                <b-col cols="10">
                  <!-- action button is very similar to the header button. -->
                  <div v-for="oneActionButton in row.item.actions" v-bind:key="oneActionButton">
                    <div
                      v-if="(oneActionButton != null && tableName != 'Resource Management') ||
                (tableName == 'Resource Management' && oneActionButton == 'Manage Quantity'  && userRole == 'Store')||
                 (tableName == 'Resource Management' && userRole == 'Admin')
                 "
                    >
                      <b-button
                        type="button"
                        v-on:click="onActionButtonClick(row.item, oneActionButton)"
                        lg="4"
                        class="w-75 mb-2"
                        variant="primary"
                        size="sm"
                      >{{oneActionButton}}</b-button>
                    </div>
                  </div>
                </b-col>

                <b-col cols="2">
                  <!-- the drop down at the right side of the row
                  is only present in the orders table.-->
                  <div v-if="tableName == 'Orders'">
                    <b-dropdown
                      v-if="userRole == 'Admin'"
                      id="dropdown-header"
                      variant="transparent"
                      no-caret
                      class="mydropdown"
                    >
                      <template slot="button-content">
                        <i class="fas fa-ellipsis-v fa-sm"></i>
                      </template>

                      <b-dropdown-item-button
                        v-on:click="editOrder(row.item.id)"
                        aria-describedby="dropdown-header-label"
                      >Edit Order</b-dropdown-item-button>
                      <b-dropdown-item-button
                        v-if="row.item.status == 'Out for Delivery'"
                        v-on:click="deliveryFailed(row.item.id)"
                        aria-describedby="dropdown-header-label"
                      >Delivery Failed</b-dropdown-item-button>
                      <b-dropdown-item-button
                        v-on:click="showCancelOrderDialog(row.item.id)"
                        aria-describedby="dropdown-header-label"
                      >Cancel Order</b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                </b-col>
              </b-row>
            </template>

            <!-- you can manually control the slot.
          notice that in the orders table, there is this line of code:
           {
          key: "refNo",
          label: "Ref. No",
          sortable: true
        },

        the key is used here to control the columns
            -->
            <template slot="refNo" slot-scope="row">
              <div style="max-width:80px;">{{row.item.refNo}}</div>
            </template>

            <!-- if there are multiple items, i will do a for loop
           and it will display multiple items. 
            -->
            <template slot="items" slot-scope="row">
              <div
                ref="itemdiv"
                v-for="(oneItem, index) in row.item.items"
                v-bind:key="oneItem.optionId"
              >
                <div class="multiRowStyle">{{oneItem.options.product.productName}}</div>
                <!-- <hr  :style="{width : mounted ? arrayOfTdWidth[0] : '150%'}"  ref="itemhr" v-if="(index + 1 ) != row.item.items.length"> -->
                <hr v-if="(index + 1 ) != row.item.items.length" />

                <br v-else />
              </div>
            </template>

            <!-- images are shown in the orders table, and it has a on
            click method which downloads the photo.-->
            <template slot="images" slot-scope="row">
              <div
                ref="imagediv"
                v-for="(oneItem, index) in row.item.items"
                v-bind:key="oneItem.optionId"
                style="cursor:pointer;"
              >
                <!-- <div style="height:60px;max-height:60px;display:block;max-width: 150px">{{oneItem.orderImageUrl}}</div> -->
                <!-- <hr :style="{width : mounted ? arrayOfTdWidth[1] : '150%'}"  ref="imageshr" v-if="(index + 1 ) != row.item.items.length"> -->
                <div @click.stop="onImageClick(oneItem.orderImageKey)">
                  <img
                    class="multiRowStyle"
                    style="max-width: 150px;"
                    v-bind:src="oneItem.orderImageUrl"
                  />
                </div>
                <hr v-if="(index + 1 ) != row.item.items.length" />
                <br v-else />
              </div>
            </template>

            <template slot="quantity" slot-scope="row">
              <div
                ref="quantitydiv"
                v-for="(oneItem, index) in row.item.items"
                v-bind:key="oneItem.optionId"
              >
                <div class="multiRowStyle">{{oneItem.quantity}}</div>
                <!-- <hr :style="{width : mounted ? arrayOfTdWidth[2] : '150%'}"  ref="quantityhr" v-if="(index + 1 ) != row.item.items.length"> -->
                <hr v-if="(index + 1 ) != row.item.items.length" />
                <br v-else />
              </div>
            </template>

            <template slot="status" slot-scope="row">
              <div style="max-width:80px;">{{row.item.status}}</div>
            </template>

            <template slot="row-details" slot-scope="row">
              <b-card>
                <ul>
                  <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                </ul>
              </b-card>
            </template>
          </b-table>

          <b-row>
            <b-col md="6" class>
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-container>

    <!-- b-modal for cancel order -->
    <b-modal @ok="cancelOrder()" ref="cancelOrder" title="Cancel Order">
      <p>Are you sure you want to cancel this order?</p>
    </b-modal>
  </div>
</template>

<script>
import { eventBus } from "@/eventBus";
import { timeout } from "q";
import {
  GET_ALL_ORDERS,
  GET_ALL_STATUS,
  UPDATE_ORDER_STATUS,
  GET_PRESIGNED_URL,
  UPDATE_RECIPIENT
} from "@/store/actions/order";
export default {
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [5, 10, 15, 20, 25],
      sortBy: null,
      sortDesc: false,
      itemsChange: [],
      sortDirection: "asc",
      filter: null,
      checkedCheckBox: [],
      checkAll: false,
      showHeaderButton: true,
      showDownloadImageButton: true,
      showDeliveryFailedButton: true,
      cancelOrderId: null,
      userRole: null
      // arrayOfTdWidth : [],
      // mounted: false,
    };
  },
  props: {
    fields: Array,
    items: Array,
    headerButton: Array,
    headerButtonClick: Array,
    actionButtonClick: String,
    enableCheckbox: Boolean,
    tableName: String,
    imageClick: String,
    isBusy: Boolean
  },
  mounted() {
    this.userRole = this.$store.getters.userRole;
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return {
            text: f.label,
            value: f.key
          };
        });
    }
  },
  watch: {
    items: {
      handler() {
        //when the items for the table changes, i will reset
        //the totalRows to reset the pagination and
        //uncheck all the checkbox
        this.totalRows = this.items.length;
        this.checkedCheckBox = [];
        this.checkAll = false;
      },
      deep: true
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    sortChanged() {
      //whnever user sort the table based on the columns, i will need to reset
      //the checkboxes.
      this.checkedCheckBox = [];
      this.checkAll = false;
    },
    deliveryFailed(orderId) {
      //this.headerButton[2].title is "Delivery Failed"
      //emit the eventBus and set the delivery to faile
      eventBus.$emit(this.headerButton[2].title, [orderId]);
    },
    //this method is used to determine which button was clicked and from which table.
    //event bus emit events and it will be detected in the orders table.
    onHeaderButtonClick(clickedHeaderTitle) {
      //for summaryoforders
      if (this.tableName == "Orders") {
        //headerButton[0] is the update status button.
        if (this.headerButton[0].title == clickedHeaderTitle) {
          eventBus.$emit(this.headerButton[0].title, this.checkedCheckBox);
          this.checkedCheckBox = [];
          this.checkAll = false;
          //headerbutton[1] in this case is download images.
        } else if (this.headerButton[1].title == clickedHeaderTitle) {
          const listOfThumbNailUrl = [];
          let index;
          for (index = 0; index < this.items.length; index++) {
            this.checkedCheckBox.forEach(checkedItemId => {
              if (this.items[index].id == checkedItemId) {
                this.items[index].items.forEach(eachItemInOrder => {
                  listOfThumbNailUrl.push(eachItemInOrder.orderImageKey);
                });
              }
            });
          }
          eventBus.$emit(this.headerButtonClick[1], listOfThumbNailUrl);
        } else if (this.headerButton[2].title == clickedHeaderTitle) {
          eventBus.$emit(this.headerButton[2].title, this.checkedCheckBox);
          this.checkedCheckBox = [];
          this.checkAll = false;
        }
      } else if (this.tableName == "Deliveries") {
        if (this.headerButton[0].title == clickedHeaderTitle) {
          eventBus.$emit(this.headerButton[0].title, this.checkedCheckBox);
          this.checkedCheckBox = [];
          this.checkAll = false;
        } else if (this.headerButton[1].title == clickedHeaderTitle) {
          eventBus.$emit(this.headerButton[1].title, this.checkedCheckBox);
          this.checkedCheckBox = [];
          this.checkAll = false;
        }
      } else if (this.tableName == "Delivery Routes") {
        eventBus.$emit(this.headerButton[0].title, this.checkedCheckBox);
      } else eventBus.$emit(this.headerButtonClick[0]);
    },
    onActionButtonClick(item, oneActionButton) {
      if (this.tableName == "Orders") {
        eventBus.$emit(this.actionButtonClick, item);
      } else if (this.tableName == "Resource Management") {
        var jsonData = {
          actionButton: oneActionButton,
          item: item
        };

        eventBus.$emit(this.actionButtonClick, jsonData);
      } else eventBus.$emit(this.actionButtonClick, item.id);
      //id is the row's item's id
    },
    onCheckBoxCheck(item) {
      let index = 0;

      //reset the conditions so as to re-check the conditions down below.
      this.showHeaderButton = true;
      this.showDownloadImageButton = false;
      this.showDeliveryFailedButton = false;

      if (item.actions[0] == null) {
        this.showHeaderButton = false;
      }

      //when items are received or awaiting printing, it will show the header
      //button: Download Images.
      if (item.status == "Received" || item.status == "Awaiting Printing") {
        this.showDownloadImageButton = true;
      }

      if (item.status == "Out for Delivery") {
        this.showDeliveryFailedButton = true;
      }

      if (this.checkedCheckBox.includes(item.id)) {
        for (index; index < this.checkedCheckBox.length; index++)
          if (this.checkedCheckBox[index] == item.id)
            this.checkedCheckBox.splice(index, 1);
      } else this.checkedCheckBox.push(item.id);
    },
    checkAllCheckBox() {
      if (this.items.length > 0) {
        let index = 0;
        //count the no of rows and check all of them.
        let rowsPerPage = this.perPage;
        let shownItems = (this.currentPage - 1) * rowsPerPage;
        //if the last page has less than 5 stuff.
        if (
          this.items.length - shownItems < rowsPerPage &&
          this.currentPage != 1
        )
          rowsPerPage = this.items.length - shownItems;

        //reset the conditions so as to re-check the conditions down below.
        this.showHeaderButton = true;
        this.showDownloadImageButton = false;
        this.showDeliveryFailedButton = false;

        if (this.items[0].actions[0] == null) {
          this.showHeaderButton = false;
        }

        if (
          this.items[0].status == "Received" ||
          this.items[0].status == "Awaiting Printing"
        ) {
          this.showDownloadImageButton = true;
        }

        if (this.items[0].status == "Out for Delivery") {
          this.showDeliveryFailedButton = true;
        }

        //if the first page has less than 5 stuff.
        if (this.currentPage == 1 && this.items.length < rowsPerPage)
          rowsPerPage = this.items.length;
        if (!this.checkAll) this.checkAll = true;
        else this.checkAll = false;
        this.checkedCheckBox = [];
        if (this.checkAll) {
          for (index = 0; index < rowsPerPage; index++) {
            this.checkedCheckBox[index] = this.items[shownItems + index].id;
          }
        }
      }
    },
    //when a row is click in the orders table, it will redirect them to the orders details.
    myRowClickHandler(record, index) {
      if (this.tableName == "Orders" || this.tableName == "Deliveries") {
        //get orderid to show in the orderdetails
        localStorage.setItem("viewOrderId", record.id);
        this.$router.replace({
          name: "OrderDetails"
        });
      }
    },
    myRowHoverHandler(record, index) {
      this.$delete(this.items[index], "_rowVariant");
    },
    editOrder(orderid) {
      localStorage.setItem("editOrderId", orderid);
      this.$router.replace({ name: "EditOrderDetails" });
    },
    showCancelOrderDialog(orderId) {
      //assign the orderId that is to be cancelled and show the modal dialog
      this.cancelOrderId = orderId;
      this.$refs["cancelOrder"].show();
    },
    cancelOrder() {
      //this method is run when the user confirm that he wants
      //to cancel the order in the modaldialog.
      var makeArray = [this.cancelOrderId];
      eventBus.$emit("cancelOrder", makeArray);
    },
    onImageClick(orderImageThumbNail) {
      if (this.tableName == "Orders")
        eventBus.$emit(this.imageClick, orderImageThumbNail);
    }
  }
};
</script>

<style scoped>
.multiRowStyle {
  height: 100px;
  max-height: 100px;
  display: block;
}
</style>

<style scoped>
.multiRowStyle {
  height: 100px;
  max-height: 100px;
  display: block;
}
</style>