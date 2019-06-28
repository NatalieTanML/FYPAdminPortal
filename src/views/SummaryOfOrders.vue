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
                <DashboardTabs v-for="tab in this.Tabs" v-bind:key="tab.id" v-bind:title="tab.title"
                  v-bind:isDark="tab.isDark" v-bind:noOfRows="arrayOfNumberOfRows[tab.id]"
                  @click.native="onTabChange(tab.id)"></DashboardTabs>
              </ul>
            </div>
          </div>
        </div>
        <!-- /.container-fluid -->

        <div cols="4">
          <Table :key="this.forceRender" v-bind:fields="this.fields" v-bind:items="this.sortItems"
            v-bind:headerButtonClick="this.headerButtonClick" v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:enableCheckbox="this.enableCheckbox" headerButton="Update Order Status">

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
    GET_ALL_STATUS
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
        headerButtonClick: "Check All Orders",
        actionButtonClick: "Edit One Order",
        forceRender: true,
        noOfTabs: 0,
        enableCheckbox: true,
        selectedTab: 0,
        arrayOfNumberOfRows: [],
        typesOfTabs: [],
        Tabs: [],
 

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
            key: "item",
            label: "Item",
            sortable: true
          },
          {
            key: "image",
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
    },

    computed: {},

    mounted() {
      this.$store
        .dispatch(GET_ALL_STATUS)
        .then(response => {

          //standardize the typesOfTabs
          let x = 1;
          this.typesOfTabs[0] = "All"
          for (x; x < response.length; x++)
            this.typesOfTabs[x] = response[x -1 ].statusName

        //had to hardcode the last tab string.
          this.typesOfTabs[x] = response[x - 1].statusName;

          let typesOfTabs = this.typesOfTabs

          //set up actions based on the type of tabs
          //you can generate the actions in the previous for loop. but i feel that
          //the code will be extra messy.

          //x = 0;
          for (x = 0; x < typesOfTabs.length; x++)
            //initialize the tabs to get title, id and isDark.
            this.Tabs[x] = {
              title: typesOfTabs[x],
              id: x,
              isDark: false
            }

          this.getAllOrders();

          

        })
        .catch(error => {

          console.dir(error);
          this.message("danger", error);
        });

      // (this.items = [
      //   {
      //     id: "123456",
      //     date: "22/04/19",
      //     item: "A5 Photo",
      //     image: "image",
      //     quantity: "2",
      //     status: "Awaiting Print",
      //     actions: "Print"
      //   },
      //   {
      //     id: "123457",
      //     date: "24/04/19",
      //     item: "Keychain",
      //     image: "image",
      //     quantity: "1",
      //     status: "Delivering",
      //     actions: "Completed"
      //   },
      //   {
      //     id: "123458",
      //     date: "25/04/19",
      //     item: "ID Card",
      //     image: "image",
      //     quantity: "2",
      //     status: "Delivering",
      //     actions: "Completed"
      //   },
      //   {
      //     id: "123459",
      //     date: "05/05/19",
      //     item: "A5 Photo + Frame",
      //     image: "image",
      //     quantity: "2",
      //     status: "Delivered",
      //     actions: "Archive"
      //   },
      //   {
      //     id: "123458",
      //     date: "28/04/19",
      //     item: "A5 Photo + Black Frame",
      //     image: "image",
      //     quantity: "1",
      //     status: "Printed",
      //     actions: "Deliver"
      //   },
      //   {
      //     id: "123459",
      //     date: "14/05/19",
      //     item: "Keychain (Black)",
      //     image: "image",
      //     quantity: "2",
      //     status: "Cancelled",
      //     actions: "Archive"
      //   },
      //   {
      //     id: "123460",
      //     date: "30/05/19",
      //     item: "Name Tag (Black)",
      //     image: "image",
      //     quantity: "1",
      //     status: "Cancelled",
      //     actions: "Archive"
      //   },
      //   {
      //     id: "123461",
      //     date: "30/05/19",
      //     item: "Name Tag (Red)",
      //     image: "image",
      //     quantity: "1",
      //     status: "Awaiting Print",
      //     actions: "Print"
      //   },
      //   {
      //     id: "123462",
      //     date: "13/05/19",
      //     item: "A4 Photo + Red Frame",
      //     image: "image",
      //     quantity: "3",
      //     status: "Ordered",
      //     actions: "Accept"
      //   },
      //   {
      //     id: "123463",
      //     date: "14/05/19",
      //     item: "Keychain",
      //     image: "image",
      //     quantity: "2",
      //     status: "Ordered",
      //     actions: "Accept"
      //   },
      //   {
      //     id: "123464",
      //     date: "23/04/19",
      //     item: "Keychain + A5 Photo",
      //     image: "image",
      //     quantity: "2",
      //     status: "Completed",
      //     actions: "Archive"
      //   },
      //   {
      //     id: "123465",
      //     date: "26/04/19",
      //     item: "A5 Photo",
      //     image: "image",
      //     quantity: "1",
      //     status: "Ordered",
      //     actions: "Accept"
      //   },
      //   {
      //     id: "123466",
      //     date: "16/04/19",
      //     item: "A3 Photo",
      //     image: "image",
      //     quantity: "2",
      //     status: "Delivering",
      //     actions: "Completed"
      //   }
      // ]);


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
        this.arrayOfNumberOfRows.push(null)
        for (index = 1; index < this.typesOfTabs.length; index++) {
          numberOfRows = 0;
          for (x = 0; x < this.items.length; x++) {
            if (this.items[x].status == this.typesOfTabs[index])
              numberOfRows++;

          }
          this.arrayOfNumberOfRows.push(numberOfRows)
        }


        if (sortBy === "All") this.sortItems = this.items;

        //to disable checkbox is All tabs are selected
        if (sortBy == "All")
          this.enableCheckbox = false
        else
          this.enableCheckbox = true

        if (this.forceRender) this.forceRender = false;
        else this.forceRender = true;
      },
      getAllOrders() {
        this.$store
          .dispatch(GET_ALL_ORDERS)
          .then(response => {
            console.log(response)

            let x = 0;

            for (x; x < response.length; x++)
              //  this.Tabs[x] = {title: typesOfTabs[x], id : x, isDark: false}
              //item: response[x].orderItems[0].options[0].product.productName,
              this.items[x] = {
                id: response[x].orderId,
                refNo : response[x].referenceNo,
                date: response[x].createdAt,
                item: response[x].orderItems[0].options.product.productName+"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n a5 photo",
                image: response[x].orderItems[0].OrderImageUrl,
                quantity: response[x].orderItems[0].quantity,
                status: response[x].status,
                actions: this.getAction(response[x].status)
              }

          
            this.sortItems = this.items;

            //creating checkbox.
            let index;
            for (index = 0; this.sortItems.length > index; index++)
              this.sortItems[index].checkbox = "checkbox"

      //selects the first tab so that the tabs will bind up with the order.
        this.onTabChange(0);

          })
          .catch(error => {

            console.dir(error);
            this.message("danger", error);
          });


      },
        getAction(status){
          if(status == "Received")
          return "Accept Order"
          else if(status == "Awaiting Printing")
          return "Print"
          else if(status == "Printed")
          return "Deliver"
          else if(status == "Out for Delivery")
          return "Delivered"
          else if(status == "Completed")
          return "Archive"
          else if(status == "Delivery Failed")
          return "Re-Deliver"
          else if(status == "Cancelled")
          return "Archive"
          else
          return null
          }

    }
  };
</script>

<style>
</style>