<template>
  <div>
    <b-container fluid>
      <div class="card shadow mb-4">
        <!-- User Interface controls -->
        <div class="card-header py-3">
          <b-row>
            <b-col class="col-12 col-md-4">
              <b-input-group class="input-group">
                <b-form-input type="text" class="form-control border-0" v-model="filter" placeholder="Type to Search">
                </b-form-input>
                <b-input-group-append class="input-group-append">
                  <b-button variant="primary">
                    <i class="fas fa-search fa-sm"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col>
              <b-button v-on:click="onHeaderButtonClick" variant="primary" class="float-right"
                v-if="headerButton && checkedCheckBox.length != 0">{{headerButton}}</b-button>
            </b-col>
          </b-row>
        </div>

        <!-- Main table element -->
        <div class="card-body">
          <b-table show-empty stacked="md" :items="items" :fields="fields" :current-page="currentPage"
            :per-page="perPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection" @row-clicked="myRowClickHandler" @filtered="onFiltered" :bordered="false"
            hover>
            <!-- <template slot="name" slot-scope="row">
        {{ row.value }} {{ row.value }}
            </template>-->
            <template v-if="enableCheckbox" slot="HEAD_checkbox">
              <b-form-checkbox @change="checkAllCheckBox()" v-model="checkAll"> </b-form-checkbox>
            </template>

            <template v-if="enableCheckbox" slot="checkbox" slot-scope="row">
              <b-form-checkbox :checked="checkedCheckBox.includes(row.item.id)" @change="onCheckBoxCheck(row.item.id)">
              </b-form-checkbox>
            </template>


            <template slot="actions" slot-scope="row">
              <b-button type="button" v-on:click="onActionButtonClick(row.item)" lg="4" class="w-75"
                variant="primary" size="sm">{{row.value}}</b-button>
              <div style="display: inline-block;margin-left:5px" v-if="tableName == 'Orders'">
                <b-dropdown id="dropdown-header" variant="transparent" no-caret class="mb-1 mydropdown">
            <template slot="button-content">  <i class="fas fa-ellipsis-v fa-sm"></i></template>
                  <b-dropdown-header id="dropdown-header-label">
                    Order
                  </b-dropdown-header>
                  <b-dropdown-divider></b-dropdown-divider>
                  <b-dropdown-item-button v-on:click="editOrder()" aria-describedby="dropdown-header-label">
                    Edit Order
                  </b-dropdown-item-button>
                  <b-dropdown-item-button  v-b-modal.cancelOrder  aria-describedby="dropdown-header-label">
                    Cancel Order
                  </b-dropdown-item-button>


                </b-dropdown>
              </div>
            </template>

            <template slot="refNo" slot-scope="row">

              <div style="max-width:80px;">{{row.item.refNo}}</div>

            </template>


            <template slot="items" slot-scope="row">
              <div ref="itemdiv" v-for="(oneItem, index) in row.item.items" v-bind:key="oneItem.optionId">
                <div style="height:60px;max-height:60px;display:block;">{{oneItem.options.product.productName}}</div>
                <!-- <hr  :style="{width : mounted ? arrayOfTdWidth[0] : '150%'}"  ref="itemhr" v-if="(index + 1 ) != row.item.items.length"> -->
                <hr v-if="(index + 1 ) != row.item.items.length">

                <br v-else>
              </div>

            </template>

            <template slot="images" slot-scope="row">
              <div  ref="imagediv" v-for="(oneItem, index) in row.item.items" v-bind:key="oneItem.optionId">
                <div style="height:60px;max-height:60px;display:block;max-width: 150px">{{oneItem.orderImageUrl}}</div>
                <!-- <hr :style="{width : mounted ? arrayOfTdWidth[1] : '150%'}"  ref="imageshr" v-if="(index + 1 ) != row.item.items.length"> -->
                <hr v-if="(index + 1 ) != row.item.items.length">
                <br v-else>
              </div>

            </template>

            <template slot="quantity" slot-scope="row">
              <div ref="quantitydiv" v-for="(oneItem, index) in row.item.items" v-bind:key="oneItem.optionId">
                <div style="height:60px;max-height:60px;display:block;">{{oneItem.quantity}}</div>
                <!-- <hr :style="{width : mounted ? arrayOfTdWidth[2] : '150%'}"  ref="quantityhr" v-if="(index + 1 ) != row.item.items.length"> -->
                <hr v-if="(index + 1 ) != row.item.items.length">
                <br v-else>
              </div>

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
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0">
              </b-pagination>
            </b-col>
          </b-row>
        </div>  
      </div>
    </b-container>

        <!-- b-modal for cancel order -->
            <b-modal @ok="cancelOrder()" id="cancelOrder" title="Cancel Order">
                <p class="my-4">Are you sure you want to cancel this order?</p>
                <!-- <p class="my-4">This action cannot be undone.</p> -->
              </b-modal>

  </div>
</template>

<script>
  import {
    eventBus
  } from "@/eventBus";
  import {
    timeout
  } from 'q';

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
        // arrayOfTdWidth : [],
        // mounted: false,
      };
    },
    props: {
      fields: Array,
      items: Array,
      headerButton: String,
      headerButtonClick: String,
      actionButtonClick: String,
      enableCheckbox: Boolean,
      tableName: String,



    },
    mounted() {
      this.totalRows = this.items.length;


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
        console.log("filtererd item : " + filteredItems)
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      onHeaderButtonClick() {
        //for summaryoforders
        if (this.tableName == "Orders"){
          eventBus.$emit(this.headerButtonClick, this.checkedCheckBox);
          this.checkedCheckBox = [];

           this.checkAll = false;
        }
        else
          eventBus.$emit(this.headerButtonClick)

      },
      onActionButtonClick(item) {
    
        if (this.tableName == "Orders"){
          const orderIds = [];
            orderIds.push(item.id);

        eventBus.$emit(this.actionButtonClick,orderIds);
        }
        else
        eventBus.$emit(this.actionButtonClick, jsonData);
        //id is the row's item's id
        
      },
      onCheckBoxCheck(refNo) {
        let index = 0;

        if (this.checkedCheckBox.includes(refNo)) {
          for (index; index < this.checkedCheckBox.length; index++)
            if (this.checkedCheckBox[index] == refNo)
              this.checkedCheckBox.splice(index, 1)
        } else
          this.checkedCheckBox.push(refNo)

        console.log(this.checkedCheckBox)

      },
      checkAllCheckBox() {
        let index = 0

        let rowsPerPage = this.perPage

        let shownItems = (this.currentPage - 1) * rowsPerPage
        // console.log(shownItems)

        //if the last page has less than 5 stuff.
        if (((this.items.length - shownItems) < rowsPerPage) && this.currentPage != 1)
          rowsPerPage = this.items.length - shownItems


        //if the first page has less than 5 stuff.
        if (this.currentPage == 1 && this.items.length < rowsPerPage)
          rowsPerPage = this.items.length

        // console.log(this.currentPage)
        // console.log(rowsPerPage)

        if (!this.checkAll)
          this.checkAll = true;
        else
          this.checkAll = false;

        this.checkedCheckBox = [];
        if (this.checkAll) {
          for (index = 0; index < rowsPerPage; index++) {
            this.checkedCheckBox[index] = this.items[shownItems + index].id;
          }
        }
        console.log(this.checkAll)
        console.log(this.checkedCheckBox)

      },
      myRowClickHandler(record, index) {
        if (this.tableName == "Orders") {
          console.log(this.items)
          console.log(index)
          //get orderid to show in the orderdetails
          localStorage.setItem("viewOrderId", this.items[index].id);
          console.log(localStorage.getItem("viewOrderId"))
          this.$router.replace({
            name: "OrderDetails"
          });
        }
      },
      editOrder() {

      },
      cancelOrder() {
            console.log("order is cancelled")
      }
    },



  };
</script>

<style>

</style>