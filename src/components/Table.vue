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
                  class="float-right"
                  v-if="(tableName != 'Orders' && tableName != 'Deliveries' ) ||
                (tableName == 'Orders' &&(checkedCheckBox.length != 0 &&(showHeaderButton && oneHeaderButton.title == 'Update Order Status') )) ||
                (tableName == 'Orders' &&(checkedCheckBox.length != 0 &&(showDownloadImageButton && oneHeaderButton.title=='Download Images') )) ||
                (tableName == 'Orders' &&(checkedCheckBox.length != 0 &&(showDeliveryFailedButton && oneHeaderButton.title=='Delivery Failed') )) ||
                (tableName == 'Deliveries' && (checkedCheckBox.length != 0 && (oneHeaderButton.title=='Update Order Status' || oneHeaderButton.title == 'Delivery Failed')))"
                >{{oneHeaderButton.title}}</b-button>
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
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @row-clicked="myRowClickHandler"
            @row-hovered="myRowHoverHandler"
            @filtered="onFiltered"
            :bordered="false"
            hover
          >
            <!-- <template slot="name" slot-scope="row">
        {{ row.value }} {{ row.value }}
            </template>-->
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
              <div v-for="oneActionButton in row.item.actions" v-bind:key="oneActionButton">
                <div v-if="oneActionButton != null" class="text-break">
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

              <div v-if="tableName == 'Orders'">
                <b-dropdown
                  id="dropdown-header"
                  variant="transparent"
                  no-caret
                  class="mydropdown float-right"
                >
                  <template slot="button-content">
                    <i class="fas fa-ellipsis-v fa-sm"></i>
                  </template>

                  <b-dropdown-item-button
                    v-on:click="editOrder(row.item.id)"
                    aria-describedby="dropdown-header-label"
                  >Edit Order</b-dropdown-item-button>
                  <b-dropdown-item-button
                    v-on:click="showCancelOrderDialog(row.item.id)"
                    aria-describedby="dropdown-header-label"
                  >Cancel Order</b-dropdown-item-button>
                </b-dropdown>
              </div>
            </template>

            <template slot="refNo" slot-scope="row">
              <div style="max-width:80px;">{{row.item.refNo}}</div>
            </template>

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

            <template slot="images" slot-scope="row">
              <div
                ref="imagediv"
                v-for="(oneItem, index) in row.item.items"
                v-bind:key="oneItem.optionId"
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
      <p class="my-4">Are you sure you want to cancel this order?</p>
      <!-- <p class="my-4">This action cannot be undone.</p> -->
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
      perPage: 5,
      pageOptions: [5, 10, 15, 20, 25],
      sortBy: null,
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      checkedCheckBox: [],
      checkAll: false,
      showHeaderButton: true,
      showDownloadImageButton: true,
      showDeliveryFailedButton: true,
      cancelOrderId: null
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
    imageClick: String
  },
  mounted() {
    this.totalRows = this.items.length;
    console.log(this.enableCheckbox);
    //to redraw the hr line.
    // if(this.$refs.itemdiv != undefined){
    //   console.log(this.$refs.itemdiv[0].clientWidth)
    // this.arrayOfTdWidth.push((this.$refs.itemdiv[0].clientWidth  + (this.$refs.itemdiv[0].clientWidth * 0.75 )) + 'px')
    // this.arrayOfTdWidth.push((this.$refs.imagediv[0].clientWidth + (this.$refs.imagediv[0].clientWidth * 0.75)) + 'px')
    // this.arrayOfTdWidth.push((this.$refs.quantitydiv[0].clientWidth + (this.$refs.quantitydiv[0].clientWidth * 0.75 )) + 'px')
    // console.log(this.arrayOfTdWidth)
    // this.mounted = true;
    // console.log(this.mounted)
    // }
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
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      console.log("filtererd item : " + filteredItems);
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onHeaderButtonClick(clickedHeaderTitle) {
      //for summaryoforders
      if (this.tableName == "Orders") {
        if (this.headerButton[0].title == clickedHeaderTitle) {
          eventBus.$emit(this.headerButton[0].title, this.checkedCheckBox);
          this.checkedCheckBox = [];
          this.checkAll = false;
        } else if (this.headerButton[1].title == clickedHeaderTitle) {
          const listOfThumbNailUrl = [];
          let index;
          for (index = 0; index < this.items.length; index++) {
            this.checkedCheckBox.forEach(checkedItemId => {
              console.log(checkedItemId);
              if (this.items[index].id == checkedItemId) {
                console.log(this.items[index]);
                this.items[index].items.forEach(eachItemInOrder => {
                  listOfThumbNailUrl.push(eachItemInOrder.orderImageKey);
                });
              }
            });
          }
          console.log(listOfThumbNailUrl);
          eventBus.$emit(this.headerButtonClick[1], listOfThumbNailUrl);
        }
        else if (this.headerButton[2].title == clickedHeaderTitle) {
          eventBus.$emit(this.headerButton[2].title, this.checkedCheckBox);
          this.checkedCheckBox = [];
          this.checkAll = false;
        }
      } else if (this.tableName == "Deliveries") {

        if(this.headerButton[0].title == clickedHeaderTitle){
        eventBus.$emit(this.headerButton[0].title, this.checkedCheckBox);
        this.checkedCheckBox = [];
        this.checkAll = false;
        }

        else if(this.headerButton[1].title == clickedHeaderTitle){
           eventBus.$emit(this.headerButton[1].title, this.checkedCheckBox);
        this.checkedCheckBox = [];
        this.checkAll = false;
        }

      } else
       eventBus.$emit(this.headerButtonClick[0]);
    },
    onActionButtonClick(item) {
      if (this.tableName == "Orders") {
        eventBus.$emit(this.actionButtonClick, item);
      } else eventBus.$emit(this.actionButtonClick, item.id);
      //id is the row's item's id
    },
    onCheckBoxCheck(item) {
      console.log(item);
      let index = 0;

      //reset the conditions so as to re-check the conditions down below.
      this.showHeaderButton = true;
      this.showDownloadImageButton = false;
      this.showDeliveryFailedButton = false;

      if (item.actions[0] == null) {
        this.showHeaderButton = false;
      }

      if (item.status == "Received" || item.status == "Awaiting Printing") {
        this.showDownloadImageButton = true;
      }

      if (item.status == "Out for Delivery") {
        this.showDeliveryFailedButton = true;
      }

      console.log(this.showHeaderButton);
      if (this.checkedCheckBox.includes(item.id)) {
        for (index; index < this.checkedCheckBox.length; index++)
          if (this.checkedCheckBox[index] == item.id)
            this.checkedCheckBox.splice(index, 1);
      } else this.checkedCheckBox.push(item.id);
      console.log(this.checkedCheckBox);
    },
    checkAllCheckBox() {
      console.log(this.items);
      if(this.items.length > 0){
      let index = 0;
      let rowsPerPage = this.perPage;
      let shownItems = (this.currentPage - 1) * rowsPerPage;
      // console.log(shownItems)
      //if the last page has less than 5 stuff.
      if (this.items.length - shownItems < rowsPerPage && this.currentPage != 1)
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
      console.log(this.showHeaderButton);

      //if the first page has less than 5 stuff.
      if (this.currentPage == 1 && this.items.length < rowsPerPage)
        rowsPerPage = this.items.length;
      // console.log(this.currentPage)
      // console.log(rowsPerPage)
      if (!this.checkAll) this.checkAll = true;
      else this.checkAll = false;
      this.checkedCheckBox = [];
      if (this.checkAll) {
        for (index = 0; index < rowsPerPage; index++) {
          this.checkedCheckBox[index] = this.items[shownItems + index].id;
        }
      }
      console.log(this.checkAll);
      console.log(this.checkedCheckBox);
      }
    },
    myRowClickHandler(record, index) {
      if (this.tableName == "Orders") {
        console.log(this.items);
        console.log(index);
        //get orderid to show in the orderdetails
        localStorage.setItem("viewOrderId", record.id);
        console.log(localStorage.getItem("viewOrderId"));
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