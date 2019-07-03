<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <!-- Content Wrapper -->
    <div id="content-wrapper">
      <!-- Main Content -->
      <div id="content">
        <!-- Topbar -->
    
          <DashboardHeader title="Resource Management"></DashboardHeader>
          <!-- Topbar Navbar -->
         

        <div>
          <Table
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:headerButtonClick="this.headerButtonClick"
            headerButton="Add Resource"
            v-bind:fields="this.fields"
            v-bind:items="this.items"
          ></Table>
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
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import { eventBus } from "@/eventBus";
import { GET_ALL_PRODUCTS } from "@/store/actions/product";

export default {
  components: {
    SideBar,
    DashboardHeader,
    Table
  },
  data() {
    return {
      headerButtonClick: "Add One Resource",
      actionButtonClick: "Edit One Resource",
      products: "",
      items: [],
      fields: [
        { key: "sku", label: "SKU", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "qtyLeft", label: "Qty Left", sortable: true },
        { key: "originalPrice", label: "Original Price", sortable: true },
        { key: "activeDiscount", label: "Active Discount", sortable: true },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    eventBus.$on(this.headerButtonClick, () => {
      this.$router.replace({ name: "AddResource" });
    });

    eventBus.$on(this.actionButtonClick, () => {
      this.$router.replace({ name: "UpdateResource" });
    });

    for(var i=0;i<10;i++){
      this.items.push({
          sku: "",
          name: "",
          qtyLeft: "",
          originalPrice: "",
          activeDiscount: "",
          actions: ""
          });
          this.items[i].sku = "1";

    }
     console.log(this.items)

    // this.$store
    //   .dispatch(GET_ALL_PRODUCTS)
    //   .then(response => {

    //     this.products = response;
    //     var x = 0;
    //     for (var i = 0; i < this.products.length; i++) {
          
    //       for(var k = 0; k < this.products[i].options.length; k++){
    //       this.items.push({
    //       sku: "",
    //       name: "",
    //       qtyLeft: "",
    //       originalPrice: "",
    //       activeDiscount: "",
    //       actions: ""
    //       });
    //       console.log(this.products[i].options[k].skuNumber);
    //       this.items[x].sku = this.products[i].options[k].skuNumber;
    //       x= x+1;
    //       // this.items[i].name  = this.products[i].productName + "(" + this.products[i].options[k].optionValue + ")";

    //       // this.items[i].qtyLeft = this.products[i].options[k].currentQuantity;
    //       // this.items[i].originalPrice = this.products[i].price;
    //       // this.items[i].activeDiscount = "this.products[i].price";
    //       // this.items[i].actions = "this.products[i].price";
          
    //     }
    //     }
    //     console.log(x);
    //     console.log(this.items);
    //     //   if(this.products[i].discountPrice.length == 0)
    //     //     this.items[i].activeDiscount = "N/A";
    //     //   else {
    //     //       for (var j = 0; j < this.products[i].discountPrice.length; j++) {
    //     //         console.log(this.products[i].discountPrice[j].isPercentage)
    //     //         if (this.products[i].discountPrice[j].isPercentage == true)
    //     //         this.items.activeDiscount = this.products[i].discountPrice[j].discountValue + "%";
    //     //         else this.items.activeDiscount = "$" + this.products[i].discountPrice[j].discountValue;
    //     //       }
    //     //   }
            
          
    //     //   this.items[i].actions = "Edit"
    //     // }

    //   })
    //   .catch(error => {

    //     alert(error);
    //   });
  }
};
</script>

<style>
</style>
