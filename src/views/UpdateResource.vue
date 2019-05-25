<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <div id="content-wrapper">
      <div id="content">
        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <DashboardHeader title="Resource Management - Update Resource"></DashboardHeader>
          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">
            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">Valerie Luna</span>
                <img
                  class="img-profile rounded-circle"
                  src="https://source.unsplash.com/QAB-WJcbgJk/60x60"
                >
              </a>
              <!-- Dropdown - User Information -->
              <div
                class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown"
              >
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                  Activity Log
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
        <b-container fluid>
          <b-row class="bg-white text-left" align-h="center">
            <b-col cols="8" class="my-5">
              <h4 class="text-uppercase">General</h4>
              <hr class="mb-5">

              <b-form class="resource-form">
                <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                <b-form-group
                  id="productId"
                  label-cols-sm="3"
                  label="Product ID"
                  label-for="input-horizontal"
                >
                  <b-form-input id="productId" value="SKU_123"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="productName"
                  label-cols-sm="3"
                  label="Product Name"
                  label-for="input-horizontal"
                >
                  <b-form-input id="productName" value="Key Chain"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="price"
                  label-cols-sm="3"
                  label="Price"
                  label-for="input-horizontal"
                >
                  <b-form-input id="price" value="$5.90"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="description"
                  label-cols-sm="3"
                  label="Description"
                  label-for="input-horizontal"
                >
                  <b-form-textarea
                    id="description"
                    rows="6"
                    value="Customisable key chain for your loved ones"
                  ></b-form-textarea>
                </b-form-group>

                <b-form-group
                  id="currentQuantity"
                  label-cols-sm="3"
                  label="Current Qty"
                  label-for="input-horizontal"
                >
                  <b-form-input id="currentQuantity" value="100"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="minimumQuantity"
                  label-cols-sm="3"
                  label="Min. Qty"
                  label-for="input-horizontal"
                >
                  <b-form-input id="minimumQuantity" value="20"></b-form-input>
                </b-form-group>

                <h4 class="text-uppercase mt-5">Discount</h4>
                <hr class="mb-5">

                <b-container class="px-0">
                  <div class="table-wrapper">
                    <div class="table-title">
                      <b-row class="mx-auto">
                        <b-col col-sm="5" class="text-left">
                          <h5>Discounts</h5>
                        </b-col>
                        <b-col col-sm="7">
                          <b-button
                            size="sm"
                            id="add-discount"
                            class="px-4 float-right"
                            variant="primary"
                            v-b-modal.addDiscount
                          >Add</b-button>
                        </b-col>
                      </b-row>
                    </div>

                    <b-table responsive striped :items="items" :fields="fields">
                      <template slot="actions">
                        <b-button
                          v-b-modal.addDiscount
                          size="sm"
                          class="px-4"
                          variant="primary"
                        >Edit</b-button>
                        <b-button
                          v-b-modal.addDiscount
                          size="sm"
                          class="px-3 ml-3"
                          variant="danger"
                        >Delete</b-button>
                      </template>
                    </b-table>
                  </div>
                </b-container>

                <!-- modal dialog -->
                <b-modal id="addDiscount" title="Add Discount" @ok="handleDiscount">
                  <form @submit.stop.prevent="submitDiscount">
                    <div class="radio-button">
                      <b-form-group
                        id="discountType"
                        label-cols-sm="3"
                        label="Type"
                        label-for="input-horizontal"
                      >
                        <b-form-radio-group
                          id="discountType"
                          class="individual-button"
                          buttons
                          button-variant="outline-secondary"
                          v-model="form.discount"
                          :options="discountOptions"
                        ></b-form-radio-group>
                      </b-form-group>
                    </div>

                    <b-form-group
                      id="discountValue"
                      label-cols-sm="3"
                      label="Value"
                      label-for="input-horizontal"
                    >
                      <b-form-input id="discountValue"></b-form-input>
                    </b-form-group>

                    <b-form-group
                      id="discountStartDate"
                      label-cols-sm="3"
                      label="Start Date"
                      label-for="input-horizontal"
                    >
                      <datepicker
                        id="discountStartDate"
                        :value="datePicker.date"
                        :bootstrap-styling="datePicker.style"
                        :format="datePicker.format"
                        :placeholder="datePicker.placeHolder"
                        required
                      ></datepicker>
                    </b-form-group>

                    <b-form-group
                      id="discountEndDate"
                      label-cols-sm="3"
                      label="End Date"
                      label-for="input-horizontal"
                    >
                      <datepicker
                        id="discountEndDate"
                        :value="datePicker.date"
                        :bootstrap-styling="datePicker.style"
                        :format="datePicker.format"
                        :placeholder="datePicker.placeHolder"
                        required
                      ></datepicker>
                    </b-form-group>
                  </form>
                </b-modal>

                <h4 class="text-uppercase mt-5">Variant</h4>
                <hr class="mb-5">

                <b-form-group
                  id="variantName"
                  label-cols-sm="3"
                  label="Name"
                  label-for="input-horizontal"
                >
                  <b-form-input id="variantName" value="Key chain with wooden frame"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="variantCategory"
                  label-cols-sm="3"
                  label="Category"
                  label-for="input-horizontal"
                >
                  <!-- 
                    1) label is used to display the option value
                    2) trackby is used to uniquely identify the option values
                    3) name property is unique across all options, so it can be used as track-by value
                    4) add the label and trackby
                  -->
                  <multiselect
                    id="variantCategory"
                    v-model="form.category"
                    deselect-label="Can't remove this value"
                    placeholder
                    :options="existingCategory"
                    label="label"
                    track-by="label"
                    @select="selectCategory"
                    :searchable="false"
                    :allow-empty="false"
                  ></multiselect>

                  <b-button class="mt-4" v-b-modal.categoryModal>Add Category</b-button>
                </b-form-group>

                <b-form-group
                  id="variantOption"
                  label-cols-sm="3"
                  label="Option"
                  label-for="input-horizontal"
                >
                  <multiselect
                    id="variantOption"
                    v-model="form.option"
                    placeholder
                    :options="existingOptions"
                    :taggable="true"
                    tag-placeholder="Press enter to create a new option"
                    @tag="addOptionToExistingCategory"
                    :allow-empty="false"
                  ></multiselect>
                </b-form-group>

                <!-- modal dialog -->
                <b-modal id="categoryModal" title="Add Category" @ok="handleCategory">
                  <form @submit.stop.prevent="submitNewCategory">
                    <b-form-group
                      id="newCategory"
                      label-cols-sm="3"
                      label="Name"
                      label-for="input-horizontal"
                    >
                      <b-form-input id="newCategory" v-model="newCategoryValue"></b-form-input>
                    </b-form-group>

                    <b-form-group
                      id="newOption"
                      label-cols-sm="3"
                      label="Option"
                      label-for="input-horizontal"
                    >
                      <multiselect
                        id="newOption"
                        v-model="newOptionValues"
                        placeholder
                        :options="newOptions"
                        :multiple="true"
                        :searchable="true"
                        :preserve-search="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :taggable="true"
                        tag-placeholder="Press enter to create a new option"
                        @tag="addOptionToNewCategory"
                        :allow-empty="false"
                      ></multiselect>
                    </b-form-group>
                  </form>
                </b-modal>

                <b-form-group
                  id="dropzone"
                  label-cols-sm="3"
                  label="Image"
                  label-for="input-horizontal"
                >
                  <vue-dropzone
                    id="dropzone"
                    ref="myVueDropzone"
                    :options="dropOptions"
                    :useCustomSlot="true"
                    @vdropzone-complete="afterComplete"
                    @vdropzone-file-added="handleMoreThumbnail"
                    @vdropzone-removed-file="handleMoreThumbnail"
                  >
                    <div class="dropzone-custom-content">
                      <i class="fas fa-cloud-upload-alt fa-3x"></i>
                      <h4 class="dropzone-custom-title mb-0 mt-3">Drag & Drop</h4>
                      <div class="subtitle">or click to add your image</div>
                      <div class="more" ref="more" v-if="addImageIndicator">+</div>
                    </div>
                  </vue-dropzone>
                </b-form-group>
              </b-form>
              <!-- <notifications/> -->
              <div class="text-right">
                <b-button @click="submit" variant="primary" class="mr-3 px-4">Save</b-button>
                <b-button class="px-4" to="/ViewResource">Cancel</b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
// 4. Change search button to a different color (instagram)
// 5. Optional change field length
// https://www.smashingmagazine.com/2018/03/ux-contact-forms-essentials-conversions/
// notification
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import vueDropzone from "vue2-dropzone";
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    SideBar,
    DashboardHeader,
    vueDropzone,
    Multiselect,
    Datepicker
  },
  data() {
    return {
      datePicker: {
        style: true,
        format: "dd/MM/yyyy",
        placeHolder: "dd/mm/yyyy"
      },

      fields: [
        { key: "Discount", label: "Discount" },
        { key: "Start", label: "Start Date" },
        { key: "End", label: "End Date" },
        { key: "actions", label: "Actions" }
      ],

      items: [
        { Discount: "10%", Start: "20/12/2019", End: "26/12/2019" },
        { Discount: "25%", Start: "30/12/2019", End: "01/01/2020" },
        { Discount: "89%", Start: "05/01/2020", End: "10/01/2020" }
      ],

      existingCategory: [
        {
          label: "Frame",
          options: ["Metal", "Wood", "Padded"]
        },
        {
          label: "Color",
          options: ["Red", "Blue", "Green"]
        }
      ],

      existingOptions: [],

      /*
       * newOptions --> Display a list of new options if user decides to create *
       * newOptionValues --> Display a list of options that user selected in the dropdown
       * newCategoryValue --> New category name that the user entered
       */
      newOptions: [],
      newOptionValues: [],
      newCategoryValue: "",

      discountOptions: ["Percentage", "Fixed"],

      /* This is similar to configuration options in dropzone.js */
      dropOptions: {
        url: "https://httpbin.org/post",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        thumbnailWidth: 160,
        thumbnailHeight: 160
      },

      addImageIndicator: false,

      form: {
        email: "",
        name: "",
        // why need to provide object? maybel because the label accepts only label key?
        category: { label: "Frame" },
        option: "Wooden",
        discount: ""
      }
    };
  },

  mounted() {
    var file = {
      size: 160,
      type: "image/jpeg"
    };
    // https://stackoverflow.com/questions/40491506/vue-js-dynamic-images-not-working
    var url = require("../assets/child.jpeg");
    this.$refs.myVueDropzone.manuallyAddFile(file, url);
  },

  methods: {
    // https://www.raymondcamden.com/2017/12/05/building-related-selects-with-vuejs
    selectCategory(selectedCategory) {
      // Once you select a new category, reset the previous options
      this.form.option = "";
      this.existingOptions = selectedCategory.options;
    },

    addOptionToExistingCategory(newOptions) {
      this.existingOptions.push(newOptions);
      this.form.option = newOptions;
    },

    addOptionToNewCategory(newOptions) {
      this.newOptions.push(newOptions);
      this.newOptionValues.push(newOptions);
    },

    handleCategory() {
      const newCategoryAndOptions = {
        label: this.newCategoryValue,
        options: this.newOptionValues
      };
      this.existingCategory.push(newCategoryAndOptions);
      console.log(this.existingCategory);

      // Once everything is done, I will reset the category and options
      this.newCategoryValue = "";
      this.newOptions = [];
      this.newOptionValues = [];
    },

    afterComplete(file) {
      console.log(file);
    },

    handleMoreThumbnail() {
      this.addImageIndicator = true;
      /*
       * this.$nextTick() will execute the following code after the next DOM update cycle
       * I use this because, once the addImageIndicator has been set to true, the div
       * with a class of "more" will appear at the screen, this will cause the DOM to be updated.
       * Once the update has been done, I will append this div to the dropzone element
       */
      this.$nextTick(() => {
        if (this.addImageIndicator) {
          let dropzone = this.$refs.myVueDropzone.dropzone;
          dropzone.files.length > 0
            ? dropzone.element.appendChild(this.$refs.more)
            : dropzone.element.removeChild(this.$refs.more);
        }
      });
    },

    handleDiscount() {
      alert("hi");
    },

    submit() {
      console.dir(this.form.category.label);
      console.dir(this.form.option);
    }
  },
  destroyed() {
    this.addImageIndicator = false;
  }
};
</script>

<style>
h4 {
  color: #6a6c78;
}

.table-wrapper {
  border: 1px solid #d1d3e2;
  margin: 30px 0;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.table-title {
  padding: 15px 0px;
}

/* https://stackoverflow.com/questions/32132711/dropzone-js-checkmark-and-x-icons-show-after-upload */
#dropzone .dz-success-mark {
  background: #5fba7d;
  border-radius: "30px";
}

.more {
  display: inline-block;
  margin: 16px;
  border: 3px dashed lightgray;
  width: 160px;
  height: 160px;
  box-sizing: border-box;
  color: lightgray;
  border-radius: 8px;
  font-size: 60px;
  text-align: center;
  line-height: 160px;
  pointer-events: none;
}

.table {
  margin-bottom: 0 !important;
}

#add-discount {
  margin-right: 63px;
}

/* https://stackoverflow.com/questions/19960162/bootstrap-3-modal-fires-and-causes-page-to-shift-to-the-left-momentarily-brows */
.modal-open .navbar-fixed-top,
.modal-open .navbar-fixed-bottom {
  padding-right: 17px;
}

/* https://github.com/charliekassel/vuejs-datepicker/issues/693 */
.vdp-datepicker .input-group .form-control[readonly] {
  background: none !important;
}

/* https://stackoverflow.com/questions/51599545/how-can-i-change-variant-of-bootstrap-vue-button-style-checkboxes-when-clicked */
.radio-button .active {
  color: #fff !important;
  background-color: #28a745 !important;
  border-color: #28a745 !important;
}

.btn-outline-secondary {
  border-color: #d1d3e2 !important;
}

/* 
 * By default, the preloaded images will have a style called object-fit: contain
 * to maintain its aspect ratio. Hence the images will appear very small
 * Therefore, I changed the value to "cover" to fill up entire content box
 */
.dz-image img {
  object-fit: cover !important;
}
</style>
