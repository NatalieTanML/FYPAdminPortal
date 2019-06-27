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
              <b-button
                v-on:click="onHeaderButtonClick()"
                variant="primary"
                class="float-right"
                v-if="headerButton"
              >{{headerButton}}</b-button>
            </b-col>
          </b-row>
        </div>

        <!-- Main table element -->
        <div class="card-body">
          <b-table
            show-empty
            stacked="md"
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @filtered="onFiltered"
            hover
          >
            <!-- <template slot="name" slot-scope="row">
        {{ row.value }} {{ row.value }}
            </template>-->
        <template v-if="enableCheckbox" slot="HEAD_checkbox">
         <b-form-checkbox  
           @change="checkAllCheckBox()" 
           v-model="checkAll"
           > </b-form-checkbox>
        </template>

         <template v-if="enableCheckbox" slot="checkbox" slot-scope="row">
             <b-form-checkbox
      :checked="checkedCheckBox.includes(row.item.id)"
      @change="onCheckBoxCheck(row.item.id)" >
    </b-form-checkbox>
            </template>


            <template slot="actions" slot-scope="row">
              <b-button
                type="button"
                v-on:click="onActionButtonClick(row.item.id)"
                lg="4"
                class="w-75"
                variant="primary"
                size="sm"
              >{{row.value}}</b-button>
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
  </div>
</template>

<script>
import { eventBus } from "@/eventBus";

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
      checkedCheckBox:[],
      checkAll : false,
    };
  },
  props: {
    fields: Array,
    items: Array,
    headerButton: String,
    headerButtonClick: String,
    actionButtonClick: String,
    enableCheckbox: Boolean,

  

  },
  mounted() {
    this.totalRows = this.items.length;
  
  },

  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      console.log("filtererd item : "+ filteredItems)
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onHeaderButtonClick() {
      //for summaryoforders
      if(this.headerButton == "Select All Orders")
      eventBus.$emit(this.headerButtonClick, this.checkedCheckBox);
      else
      eventBus.$emit(this.headerButtonClick)

    },
    onActionButtonClick(id) {
      eventBus.$emit(this.actionButtonClick, id);
    },
    onCheckBoxCheck(refNo){
      let index = 0;

      if(this.checkedCheckBox.includes(refNo)){
      for(index;index< this.checkedCheckBox.length; index ++)
        if(this.checkedCheckBox[index] == refNo)
        this.checkedCheckBox.splice(index,1)
      }
      else
      this.checkedCheckBox.push(refNo)

      console.log(this.checkedCheckBox)
  
    },
    checkAllCheckBox(){
    let index = 0

    let rowsPerPage = this.perPage

    let shownItems = (this.currentPage - 1) * rowsPerPage
    // console.log(shownItems)

  //if the last page has less than 5 stuff.
    if(((this.items.length - shownItems) <rowsPerPage) && this.currentPage != 1 )
    rowsPerPage = this.items.length - shownItems
  
    
    //if the first page has less than 5 stuff.
    if(this.currentPage == 1 && this.items.length < rowsPerPage)
    rowsPerPage = this.items.length 
    
    // console.log(this.currentPage)
    // console.log(rowsPerPage)

    if(!this.checkAll)
    this.checkAll = true;
    else
    this.checkAll = false;

    this.checkedCheckBox = [];  
      if(this.checkAll){
      for(index = 0; index<rowsPerPage; index++){
       this.checkedCheckBox[index] = this.items[shownItems + index].id;
      }
      }
      console.log(this.checkAll)
      console.log(this.checkedCheckBox)

}
  },

  
      
};
</script>

<style>
</style>
