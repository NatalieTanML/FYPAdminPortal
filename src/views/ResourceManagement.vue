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
                  v-bind:noOfRows="tab.noOfRows"
                  @click.native="onTabChange(tab.id)"
                ></DashboardTabs>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <Table
            v-bind:actionButtonClick="this.actionButtonClick"
            v-bind:headerButtonClick="this.headerButtonClick"
            :headerButton="headerButton"
            v-bind:fields="this.fields"
            v-bind:items="this.sortItems"
            v-bind:tableName="this.tableName"
          ></Table>
          <b-modal
            id="manageQuantity"
            ref="modal"
            title="Manage Resource Quantity"
            @ok="updateQuantity"
            ok-title="Save"
          >
            <div class="radio-button">
              <b-form-group
                id="quantityOption"
                label-cols-sm="3"
                label="Option :"
                label-for="input-horizontal"
              >
                <b-form-radio-group
                  id="quantityOption"
                  class="individual-button"
                  buttons
                  button-variant="outline-secondary"
                  v-model="form.quantityOption"
                  :options="quantityOptions"
                  v-on:input="updateEffectiveQuantity()"
                ></b-form-radio-group>
              </b-form-group>
            </div>
            <b-form-group
              id="quantityValue"
              label-cols-sm="3"
              label="Value :"
              label-for="input-horizontal"
            >
              <b-form-input
                id="quantityValue"
                placeholder="Please enter quantity value"
                v-model="form.quantityValue"
                :state="$v.form.quantityValue.$dirty ? !$v.form.quantityValue.$error : null"
                aria-describedby="input-2-live-feedback"
                v-on:input="updateEffectiveQuantity()"
              ></b-form-input>
              <b-form-invalid-feedback id="input-2-live-feedback">
                <p v-if="!$v.form.quantityValue.required">Quantity value is required !</p>
                <p
                  v-if="!$v.form.quantityValue.numeric"
                >Please enter your quantity value in numeric !</p>
                <p v-if="!$v.form.quantityValue.limit">Quantity value exceeds limit !</p>
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              id="currentQuantity"
              label-cols-sm="3"
              label="Currenct Quantity :"
              label-for="input-horizontal"
            >
              <b-form-text id="currentQuantity">{{form.currentQuantity}}</b-form-text>
            </b-form-group>

            <b-form-group
              id="effectiveQuantity"
              label-cols-sm="3"
              label="Effective Quantity :"
              label-for="input-horizontal"
              v-model="form.effectiveQuantity"
            >
              <b-form-text id="effectiveQuantity">{{form.effectiveQuantity}}</b-form-text>
            </b-form-group>
          </b-modal>
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
import { GET_ALL_PRODUCTS, UPDATE_STOCK } from "@/store/actions/product";
import { METHODS } from "http";
import { required, numeric } from "vuelidate/lib/validators";
import DashboardTabs from "@/components/DashboardTabs";

export default {
  components: {
    SideBar,
    DashboardHeader,
    DashboardTabs,
    Table
  },
  data() {
    return {
      form: {
        quantityOption: "Increase",
        quantityValue: null,
        currentQuantity: null,
        effectiveQuantity: null
      },
      headerButtonClick: ["Add Resource"],
      headerButton: [{ id: 1, title: "Add Resource" }],
      actionButtonClick: "Resource Action Buttons",
      products: "",
      tableName: "Resource Management",
      optionId: "",
      items: [],
      quantityOptions: ["Increase", "Reduce"],
      fields: [
        { key: "sku", label: "SKU", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "qtyLeft", label: "Qty Left", sortable: true },
        { key: "originalPrice", label: "Original Price", sortable: true },
        { key: "activeDiscount", label: "Active Discount", sortable: true },
        { key: "availability", label: "Availability", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      typesOfTabs: ["All Products", "Out Of Stock", "Visible", "Not Visible"],
      selectedTab: 0, // Currently selected tab
      arrayOfNumberOfRows: [], // Display the number of rows for each tab
      noOfTabs: 0,
      tabs: [],
      sortItems: []
    };
  },
  validations: {
    form: {
      quantityOption: {
        required
      },
      quantityValue: {
        required,
        numeric,
        limit(value) {
          if (
            this.form.quantityOption == "Reduce" &&
            value > this.form.currentQuantity
          )
            return false;
          else return true;
        }
      }
    }
  },
  mounted() {
    eventBus.$on(this.headerButtonClick[0], () => {
      this.$router.replace({ name: "AddResource" });
    });

    eventBus.$on(this.actionButtonClick, jsonData => {
      if (jsonData.actionButton == "Edit Resource") {
        localStorage.setItem("updateResourceId", jsonData.item.productId);
        this.$router.replace({ name: "UpdateResource" });
      }
      if (jsonData.actionButton == "Manage Resource Quantity") {
        this.optionId = jsonData.item.optionId;
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].optionId == jsonData.item.optionId) {
            this.form.currentQuantity = this.items[i].qtyLeft;
          }
        }
        this.form.quantityValue = null;
        this.form.effectiveQuantity = null;
        this.$v.$reset();
        this.$bvModal.show("manageQuantity");
      }
      if (jsonData.actionButton == "View Resource") {
        localStorage.setItem("viewResourceId", jsonData.item.productId);
        // this.$router.replace({ name: "ViewResource" });
        let routeData = this.$router.resolve({
          name: "ViewResource"
        });
        window.open(routeData.href, "_blank");
      }
    });

    this.$store
      .dispatch(GET_ALL_PRODUCTS)
      .then(response => {
        this.products = response;
        console.log(this.products);
        var x = 0;
        for (var i = 0; i < this.products.length; i++) {
          for (var k = 0; k < this.products[i].options.length; k++) {
            this.items.push({
              sku: "",
              name: "",
              qtyLeft: "",
              originalPrice: "",
              activeDiscount: "",
              availability: "",
              actions: ""
            });

            if (new Date() > new Date(this.products[i].effectiveStartDate)) {
              if (
                this.products[i].effectiveEndDate == null ||
                new Date() < new Date(this.products[i].effectiveEndDate)
              ) {
                if (this.products[i].options[k].currentQuantity == 0)
                  this.items[x].availability = "Available, Out Of Stock";
                else this.items[x].availability = "Available";
              } else {
                if (this.products[i].options[k].currentQuantity == 0)
                  this.items[x].availability = "Expired, Out Of Stock";
                else this.items[x].availability = "Expired";
              }
            } else {
              if (this.products[i].options[k].currentQuantity == 0)
                this.items[x].availability = "Not Active, Out Of Stock";
              else this.items[x].availability = "Not Active";
            }
            this.items[x].optionId = this.products[i].options[k].optionId;
            this.items[x].productId = this.products[i].productId;
            this.items[x].sku = this.products[i].options[k].skuNumber;
            this.items[x].name += this.products[i].productName + " (";
            var atr = 1;
            for (
              var a = 0;
              a < this.products[i].options[k].attributes.length;
              a++
            ) {
              if (atr == this.products[i].options[k].attributes.length)
                this.items[x].name +=
                  this.products[i].options[k].attributes[a].attributeValue +
                  ")";
              else
                this.items[x].name +=
                  this.products[i].options[k].attributes[a].attributeValue +
                  ",";
              atr++;
            }

            this.items[x].qtyLeft = this.products[i].options[k].currentQuantity;
            this.items[x].originalPrice = this.$options.filters.currency(
              this.products[i].price
            );

            if (this.products[i].discountPrice.length == 0)
              this.items[x].activeDiscount = "No Active Discount";
            else {
              for (var j = 0; j < this.products[i].discountPrice.length; j++) {
                if (
                  new Date() >
                  new Date(this.products[i].discountPrice[j].effectiveStartDate)
                ) {
                  if (
                    this.products[i].discountPrice[j].effectiveEndDate ==
                      null ||
                    new Date() <
                      new Date(
                        this.products[i].discountPrice[j].effectiveEndDate
                      )
                  ) {
                    if (this.products[i].discountPrice[j].isPercentage == true)
                      this.items[x].activeDiscount =
                        this.products[i].discountPrice[j].discountValue + "%";
                    else
                      this.items[x].activeDiscount =
                        "$" + this.products[i].discountPrice[j].discountValue;
                  } else this.items[x].activeDiscount = "No Active Discount";
                } else this.items[x].activeDiscount = "No Active Discount";
              }
            }

            console.log(this.items);

            this.items[x].actions = [
              "Edit Resource",
              "Manage Resource Quantity",
              "View Resource"
            ];
            x++;
          }
        }
        this.setUpTabs();
      })
      .catch(error => {
        alert(error);
      });
  },
  methods: {
    setUpTabs() {
      let number = 0;
      console.log(this.products);
      this.products.forEach(product => {
        product.options.forEach(option => {
          number += 1;
        });
      });
      console.log(number);
      let x;
      let index;
      let numberOfRows = 0;
      this.arrayOfNumberOfRows = [0, 0, 0, 0];

      // Since we are not going to continue the number of rows for the first tab,
      // we are going to push a null value
      this.arrayOfNumberOfRows.push(null);
      let times = 0;

      this.products.forEach(product => {
        product.options.forEach(option => {
          console.log(option);
          option.status = [];
          times += 1;

          if (option.currentQuantity === 0) {
            this.arrayOfNumberOfRows[1] += 1;
            option.status.push("Out Of Stock");
          }

          let startDate = product.effectiveStartDate;
          let endDate = product.effectiveEndDate;

          startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
          endDate !== null
            ? (endDate = new Date(new Date(endDate).setHours(0, 0, 0, 0)))
            : (endDate = null);
          let todayDate = new Date(new Date().setHours(0, 0, 0, 0));

          if (
            (startDate <= todayDate && endDate > todayDate) ||
            (startDate <= todayDate && endDate === null)
          ) {
            this.arrayOfNumberOfRows[2] += 1;
            option.status.push("Visible");
          } else {
            console.log(startDate);
            console.log(endDate);
            console.log(todayDate);
            this.arrayOfNumberOfRows[3] += 1;
            option.status.push("Not Visible");
          }
        });
      });

      console.log(times);
      console.log(this.arrayOfNumberOfRows);

      let typesOfTabs = this.typesOfTabs;
      this.Tabs = [];

      for (x = 0; x < typesOfTabs.length; x++)
        // Initialize the tabs to get title, id and isDark.
        this.Tabs[x] = {
          title: typesOfTabs[x],
          id: x,
          isDark: false,
          noOfRows: this.arrayOfNumberOfRows[x]
        };

      // selects current tabs. By default, it will be 0
      this.onTabChange(this.selectedTab);
    },

    onTabChange(id) {
      //const {sortItems, items, noOfTabs, Tabs, selectedTab, typesOfTabs} = this
      //reason why i don't use const ^ is because when the data is displayed,
      //it will become read-only.
      console.log("on tab change is called");
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

      let sortBy = this.typesOfTabs[id];
      //  typesOfTabs: ["All Products", "Out Of Stock", "Visible", "Not Visible"],
      let sortedIndex = 0;
      this.products.forEach(product => {
        product.options.forEach(option => {
          if (option.status.includes(sortBy)) {
            console.log(this.items[sortedIndex]);
            this.sortItems.push(this.items[sortedIndex]);
          }
          ++sortedIndex;
        });
      });
    },

    updateEffectiveQuantity() {
      if (this.form.quantityOption == "Increase") {
        if (this.form.quantityValue != null) {
          if (this.form.quantityValue.match(/^[0-9]+$/) != null)
            this.form.effectiveQuantity =
              parseInt(this.form.currentQuantity) +
              parseInt(this.form.quantityValue);
          else this.form.effectiveQuantity = "Please enter numeric value";
        } else this.form.effectiveQuantity = "Please enter numeric value";
      } else {
        if (this.form.quantityValue != null) {
          if (this.form.quantityValue.match(/^[0-9]+$/) != null) {
            if (this.form.quantityValue > this.form.currentQuantity)
              this.form.effectiveQuantity =
                "Reduce quantity value exceeds limit";
            else
              this.form.effectiveQuantity =
                parseInt(this.form.currentQuantity) -
                parseInt(this.form.quantityValue);
          } else this.form.effectiveQuantity = "Please enter numeric value";
        } else this.form.effectiveQuantity = "Please enter numeric value";
      }
    },

    updateQuantity(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else if (
        this.form.quantityOption == "Reduce" &&
        this.form.quantityValue > this.form.currentQuantity
      ) {
        alert("Quantity value exceeds limit");
      } else {
        if (this.form.quantityOption == "Increase") {
          this.$store
            .dispatch(UPDATE_STOCK, [this.optionId, this.form.quantityValue])
            .then(response => {
              this.refreshTable();
            })
            .catch(error => {
              alert(error);
            });
        } else {
          this.$store
            .dispatch(UPDATE_STOCK, [this.optionId, -this.form.quantityValue])
            .then(response => {
              this.refreshTable();
            })
            .catch(error => {
              alert(error);
            });
        }
        // Hide the modal manually
        this.$nextTick(() => {
          this.$refs.modal.hide();
        });
      }
    },

    refreshTable() {
      this.$store
        .dispatch(GET_ALL_PRODUCTS)
        .then(response => {
          console.log(response);
          this.products = response;
          var x = 0;
          for (var i = 0; i < this.products.length; i++) {
            for (var k = 0; k < this.products[i].options.length; k++) {
              if (new Date() > new Date(this.products[i].effectiveStartDate)) {
                if (
                  this.products[i].effectiveEndDate == null ||
                  new Date() < new Date(this.products[i].effectiveEndDate)
                ) {
                  if (this.products[i].options[k].currentQuantity == 0)
                    this.items[x].availability = "Available, Out Of Stock";
                  else this.items[x].availability = "Available";
                } else {
                  if (this.products[i].options[k].currentQuantity == 0)
                    this.items[x].availability = "Expired, Out Of Stock";
                  else this.items[x].availability = "Expired";
                }
              } else {
                if (this.products[i].options[k].currentQuantity == 0)
                  this.items[x].availability = "Not Active, Out Of Stock";
                else this.items[x].availability = "Not Active";
              }
              this.items[x].optionId = this.products[i].options[k].optionId;
              this.items[x].sku = this.products[i].options[k].skuNumber;
              this.items[x].name =
                this.products[i].productName +
                "(" +
                this.products[i].options[k].optionValue +
                ")";
              this.items[x].qtyLeft = this.products[i].options[
                k
              ].currentQuantity;
              this.items[x].originalPrice = this.$options.filters.currency(
                this.products[i].price
              );

              if (this.products[i].discountPrice.length == 0)
                this.items[x].activeDiscount = "No Active Discount";
              else {
                for (
                  var j = 0;
                  j < this.products[i].discountPrice.length;
                  j++
                ) {
                  if (
                    new Date() >
                    new Date(
                      this.products[i].discountPrice[j].effectiveStartDate
                    )
                  ) {
                    if (
                      this.products[i].discountPrice[j].effectiveEndDate ==
                        null ||
                      new Date() <
                        new Date(
                          this.products[i].discountPrice[j].effectiveEndDate
                        )
                    ) {
                      if (
                        this.products[i].discountPrice[j].isPercentage == true
                      )
                        this.items[x].activeDiscount =
                          this.products[i].discountPrice[j].discountValue + "%";
                      else
                        this.items[x].activeDiscount =
                          "$" + this.products[i].discountPrice[j].discountValue;
                    } else this.items[x].activeDiscount = "No Active Discount";
                  } else this.items[x].activeDiscount = "No Active Discount";
                }
              }

              this.items[x].actions = [
                "Edit Resource",
                "Manage Resource Quantity",
                "View Resource"
              ];
              x++;
            }
          }
          this.setUpTabs();
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style>
</style>
