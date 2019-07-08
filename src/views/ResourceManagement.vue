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
            :headerButton="headerButton"
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
    Table,
    

  },
  data() {
    return {
      headerButtonClick: "Add Resource",
      headerButton: [{id: 1, title: "Add Resource"}],
      actionButtonClick: "Edit One Resource",
      products: "",
      items: [],
      fields: [
        { key: "sku", label: "SKU", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "qtyLeft", label: "Qty Left", sortable: true },
        { key: "originalPrice", label: "Original Price", sortable: true },
        { key: "activeDiscount", label: "Active Discount", sortable: true },
        { key: "availability", label: "Availability", sortable: true },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    eventBus.$on(this.headerButtonClick[0], () => {
      this.$router.replace({ name: "AddResource" });
    });

    eventBus.$on(this.actionButtonClick, () => {
      this.$router.replace({ name: "UpdateResource" });
    });

    this.$store
      .dispatch(GET_ALL_PRODUCTS)
      .then(response => {

        this.products = response;
        var x = 0;
        for (var i = 0; i < this.products.length; i++) {
          for(var k = 0; k < this.products[i].options.length; k++){
          this.items.push({
          sku: "",
          name: "",
          qtyLeft: "",
          originalPrice: "",
          activeDiscount: "",
          availability:"",
          actions: ""
          });
          if(new Date() > new Date(this.products[i].effectiveStartDate)){
            if(this.products[i].effectiveEndDate == null || new Date() < new Date(this.products[i].effectiveEndDate))
            this.items[x].availability = "Available";
            else this.items[x].availability = "Expired";
          }else this.items[x].availability = "Not Active";
          this.items[x].sku = this.products[i].options[k].skuNumber;
          this.items[x].name  = this.products[i].productName + "(" + this.products[i].options[k].optionValue + ")";
          this.items[x].qtyLeft = this.products[i].options[k].currentQuantity;
          this.items[x].originalPrice = this.$options.filters.currency(this.products[i].price);

         if(this.products[i].discountPrice.length == 0)
            this.items[x].activeDiscount = "No Active Discount";
          else {
              for (var j = 0; j < this.products[i].discountPrice.length; j++) {
                if(new Date() > new Date(this.products[i].discountPrice[j].effectiveStartDate))
                {
                  if(this.products[i].discountPrice[j].effectiveEndDate == null || new Date() < new Date(this.products[i].discountPrice[j].effectiveEndDate))
                  {
                    if (this.products[i].discountPrice[j].isPercentage == true)
                    this.items[x].activeDiscount = this.products[i].discountPrice[j].discountValue + "%";
                    else this.items[x].activeDiscount = "$" + this.products[i].discountPrice[j].discountValue;
                  }
                  else this.items[x].activeDiscount = "No Active Discount";
                }
                else this.items[x].activeDiscount = "No Active Discount";
                
              }
          }
            
          
          this.items[x].actions = ["Edit","Add"];
          x= x+1;
        }
         
        }
        console.log(this.items)
        
        
         

      })
      .catch(error => {

        alert(error);
      });
  }
};
</script>

<style>
</style>
