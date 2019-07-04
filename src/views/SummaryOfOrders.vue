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
                <DashboardTabs
                  v-for="tab in this.Tabs"
                  v-bind:key="tab.id"
                  v-bind:title="tab.title"
                  v-bind:isDark="tab.isDark"
                  v-bind:noOfRows="arrayOfNumberOfRows[tab.id]"
                  @click.native="onTabChange(tab.id)"
                ></DashboardTabs>
              </ul>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

        <div cols="4">
          <Table :key="this.forceRender" v-bind:fields="this.fields" v-bind:items="this.sortItems"
            v-bind:headerButtonClick="this.headerButtonClick" v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:enableCheckbox="this.enableCheckbox" tableName="Orders" :imageClick ="this.imageClick" :headerButton="this.headerButton">

          </Table>
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
    GET_ALL_STATUS,
    UPDATE_ORDER_STATUS,
    GET_PRESIGNED_URL
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
        //have multiple buttons
        headerButtonClick:["Update Order Status","Download Images"],

        headerButton:[
           {
          id: 1,
          title: "Update Order Status",
           },
          {
          id: 2,
          title: "Download Images"
           }
        ],
        actionButtonClick: "Update One Order Status",
        imageClick: "On Order Image Click",
        forceRender: true,
        noOfTabs: 0,
        enableCheckbox: true,
        selectedTab: 0,
        arrayOfNumberOfRows: [],
        typesOfTabs: [],
        Tabs: [],
        presignedUrl: "",


        sortItems: [],

        items: [],
        fields: [{
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
            label: "Qty",
            sortable: true
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
        ]
      };
      this.$snack[method](config);
      // this.$snack[method](config)
    },
    onTabChange(id) {
      //const {sortItems, items, noOfTabs, Tabs, selectedTab, typesOfTabs} = this
      //reason why i don't use const ^ is because when the data is displayed,
      //it will become read-only.

      this.sortItems = [];
      //change background color for the tab
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

      for (index = 0; index < this.items.length; index++)
        if (sortBy === this.items[index].status)
          this.sortItems.push(this.items[index]);

      //for counting the amount of rows in each tab.
      let numberOfRows = 0;
      let x;
      //index is 1 so as to skip the All tab. then i push a 0 on the first
      //number of the arrayofNumberOfRows.
      this.arrayOfNumberOfRows.push(null);
      for (index = 1; index < this.typesOfTabs.length; index++) {
        numberOfRows = 0;
        for (x = 0; x < this.items.length; x++) {
          if (this.items[x].status == this.typesOfTabs[index]) numberOfRows++;
        }
        this.arrayOfNumberOfRows.push(numberOfRows);
      }

      if (sortBy === "All") this.sortItems = this.items;

      //to disable checkbox is All tabs are selected
      if (sortBy == "All") this.enableCheckbox = false;
      else this.enableCheckbox = true;

      if (this.forceRender) this.forceRender = false;
      else this.forceRender = true;
    },
    getAllOrders() {
      this.$store
        .dispatch(GET_ALL_ORDERS)
        .then(response => {
          //standardize the typesOfTabs
          //set up default tabs.
          let x = 1;
          this.typesOfTabs[0] = "All"
          for (x; x < response.length; x++)
            this.typesOfTabs[x] = response[x - 1].statusName

          //had to hardcode the last tab string.
          this.typesOfTabs[x] = response[x - 1].statusName;
          this.getAllOrders();
        })
        .catch(error => {

          console.dir(error);
          this.message("danger", error);
        });

      eventBus.$on(this.headerButtonClick[0], (orderIds) => {
          this.updateStatusTabsAndTable(orderIds);
      });

      eventBus.$on(this.actionButtonClick, (orderIds) => {
    this.updateStatusTabsAndTable(orderIds);
      });

      eventBus.$on(this.imageClick, (thumbNailUrl) => {
        //because controller only accepts a list of url
        const listOfThumbNailUrl = []
        listOfThumbNailUrl.push(thumbNailUrl);
     

        this.$store
        .dispatch(GET_PRESIGNED_URL, listOfThumbNailUrl)
        .then(response => {
        console.log(response)
        this.downloadURI(response.imgUrls[0],"a")
        // this.presignedUrl = response.imgUrls[0];
        // this.$bvModal.show("viewPresignedImage");
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error);
        });
    
      });
      


    },
    //  beforeDestory(){
    //   eventBus.$off(this.headerButtonClick);
    //      eventBus.$off(this.actionButtonClick);
    // },
    methods: {
      message(method, messageText) {
        let config = {
          text: messageText,
          button: "ok"
        };
        this.$snack[method](config);
        // this.$snack[method](config)
      },
      getAllOrders() {
        this.$store
          .dispatch(GET_ALL_ORDERS)
          .then(response => {

            let x = 0;

            for (x; x < response.length; x++) {
              //  this.Tabs[x] = {title: typesOfTabs[x], id : x, isDark: false}
              //item: response[x].orderItems[0].options[0].product.productName,
              this.items[x] = {
                id: response[x].orderId,
                refNo: response[x].referenceNo,
                date: (response[x].createdAt).substring(0, 10),
                items: response[x].orderItems,
                images: response[x].orderItems,
                quantity: response[x].orderItems,
                status: response[x].status,
                actions: this.getAction(response[x].status),
               
                              
            }
            }



            //creating checkbox.
            let index;
            for (index = 0; this.items.length > index; index++)
              this.items[index].checkbox = "checkbox"


            //for counting the amount of rows in each tab.


            this.setUpTabs()
      

          })
          .catch(error => {

            console.dir(error);
            this.message("danger", error);
          });


      },
      onTabChange(id) {
        //const {sortItems, items, noOfTabs, Tabs, selectedTab, typesOfTabs} = this
        //reason why i don't use const ^ is because when the data is displayed,
        //it will become read-only.
        console.log("on tab change is called")

        this.sortItems = [];
        //change background color for the tab
        
        //will have an error if you remove this if statement.
        //because the html section will run first, then it will cause an error
        //because the tabs have not been created.
        if(this.$refs.tabs != undefined)
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

        for (index = 0; index < this.items.length; index++)
          if (sortBy === this.items[index].status)
            this.sortItems.push(this.items[index]);



        if (sortBy === "All") this.sortItems = this.items;

        //to disable checkbox is All tabs are selected
        if (sortBy == "All")
          this.enableCheckbox = false
        else
          this.enableCheckbox = true

        // if (this.forceRender) this.forceRender = false;
        // else this.forceRender = true;
      },
      setUpTabs() {
        console.log("set up tab is called")

        let x;
        let index;
        let numberOfRows = 0;

        this.arrayOfNumberOfRows = []
        //index is 1 so as to skip the All tab. then i push a 0 on the first
        //number of the arrayofNumberOfRows.
        this.arrayOfNumberOfRows.push(null)
        for (index = 1; index < this.typesOfTabs.length; index++) {
          numberOfRows = 0;
          for (x = 0; x < this.items.length; x++) {
            if (this.items[x].status == this.typesOfTabs[index])
              numberOfRows++;

          }
          this.arrayOfNumberOfRows.push(numberOfRows)

          //set up tabs after getting all the items and what


        }


        let typesOfTabs = this.typesOfTabs

        //set up actions based on the type of tabs
        //you can generate the actions in the previous for loop. but i feel that
        //the code will be extra messy.

        //reset tab.
       
        this.Tabs = []

        for (x = 0; x < typesOfTabs.length; x++)
          //initialize the tabs to get title, id and isDark.
          this.Tabs[x] = {
            title: typesOfTabs[x],
            id: x,
            isDark: false,
            noOfRows: this.arrayOfNumberOfRows[x]
          }

            //selects current tabs.
            //if no tab is selected, the default will be 0
           this.onTabChange(this.selectedTab)

      },


      getAction(status) {
        if (status == "Received")
          return "Accept Order"
        else if (status == "Awaiting Printing")
          return "Print"
        else if (status == "Printed")
          return "Deliver"
        else if (status == "Out for Delivery")
          return "Delivered"
        else if (status == "Completed")
          return null
        else if (status == "Delivery Failed")
          return "Re-Deliver"
        else if (status == "Cancelled")
          return null
        else
          return null
      },

      updateStatusTabsAndTable(orderIds){

            //isSuccessful will always be true unless the admin presses on the dropdown at the
          //end of the row and click cancel order

            const isSuccessful = true;
           
         const jsonData = {
            "orderIds": orderIds,
            "isSuccessful": isSuccessful
         } 

            this.$store
          .dispatch(UPDATE_ORDER_STATUS, jsonData)
          .then(response => {
            this.message("success", "Order Status(es) is updated successfully!");
            console.log(response)
            let updatedOrders = response.orders;
            let x;
            for (x = 0; x < this.items.length; x++) { 
              updatedOrders.forEach((oneUpdatedOrder, index) => {
                if (this.items[x].id == oneUpdatedOrder.orderId) {
                  this.items[x].status = oneUpdatedOrder.statusName;
                  this.items[x].actions = this.getAction(oneUpdatedOrder.statusName)
                 
                }

              })
            }

            //reset the tabs.
            this.setUpTabs();

            //there is a few lines in the router.js where i reset the eventbus listener too
            //do take note of that.

          })
          .catch(error => {
            console.dir(error);
            this.message("danger", error);
          });


      },
  downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link.download;
  delete link.href
},

    }
  }
