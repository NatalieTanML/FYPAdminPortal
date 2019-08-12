<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <div id="content-wrapper">
      <div id="content">
        <DashboardHeader title="Resource Management - Update Resource"></DashboardHeader>

        <b-container fluid>
          <div class="card shadow mb-4">
            <b-row class="text-left" align-h="center">
              <b-col lg="9" md="10" cols="11" class="my-5">
                <h4 class="text-uppercase">General</h4>
                <hr class="mb-5" />

                <b-form class="resource-form">
                  <b-form-group
                    id="productName"
                    label-cols-sm="3"
                    label="Product Name"
                    label-for="input-horizontal"
                  >
                    <b-form-input
                      id="productName"
                      v-model="$v.form.name.$model"
                      :state="$v.form.name.$dirty ? !$v.form.name.$error : null"
                    ></b-form-input>

                    <b-form-invalid-feedback>Name is required</b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group
                    id="price"
                    label-cols-sm="3"
                    label="Price"
                    label-for="input-horizontal"
                  >
                    <b-input-group prepend="$">
                      <b-form-input
                        id="price"
                        v-model="$v.form.price.$model"
                        :state="$v.form.price.$dirty ? !$v.form.price.$error : null"
                        maxlength="7"
                      ></b-form-input>

                      <b-form-invalid-feedback>
                        <p v-if="!$v.form.price.required">Price is required</p>
                        <p
                          v-if="!$v.form.price.twoDecimal"
                        >Please enter a valid number and not more than 2 decimal places</p>
                        <p v-if="!$v.form.price.maxValue">Price cannot exceed more than 9999.99</p>
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-form-group>

                  <b-form-group
                    id="imageWidth"
                    label-cols-sm="3"
                    label="Width"
                    label-for="input-horizontal"
                  >
                    <b-form-input
                      id="imageWidth"
                      v-model="$v.form.imageWidth.$model"
                      :state="$v.form.imageWidth.$dirty ? !$v.form.imageWidth.$error : null"
                    ></b-form-input>

                    <b-form-invalid-feedback>
                      <p v-if="!$v.form.imageWidth.required">Width is required</p>
                      <p
                        v-if="!$v.form.imageWidth.decimal
                      ||
                      !$v.form.imageWidth.minValue"
                      >Please enter a valid number</p>
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group
                    id="imageHeight"
                    label-cols-sm="3"
                    label="Height"
                    label-for="input-horizontal"
                  >
                    <b-form-input
                      id="imageHeight"
                      v-model="$v.form.imageHeight.$model"
                      :state="$v.form.imageHeight.$dirty ? !$v.form.imageHeight.$error : null"
                    ></b-form-input>

                    <b-form-invalid-feedback>
                      <p v-if="!$v.form.imageHeight.required">Height is required</p>
                      <p
                        v-if="!$v.form.imageHeight.decimal || !$v.form.imageHeight.minValue"
                      >Please enter a valid number</p>
                    </b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group
                    id="startDate"
                    label-cols-sm="3"
                    label="Start Date"
                    label-for="input-horizontal"
                  >
                    <datepicker
                      :id="(!$v.form.effectiveStartDate.$dirty) ? 'startDate' : ($v.form.effectiveStartDate.$error) ? 'date-invalid' : 'date-valid' "
                      :value="datePicker.date"
                      :bootstrap-styling="datePicker.style"
                      :format="datePicker.format"
                      :placeholder="datePicker.placeHolder"
                      v-model="$v.form.effectiveStartDate.$model"
                      :class="(!$v.form.effectiveStartDate.$dirty) ? null : ($v.form.effectiveStartDate.$error) ? 'is-invalid-icon' : 'is-valid-icon' "
                    ></datepicker>

                    <div v-if="$v.form.effectiveStartDate.$dirty" class="date-invalid-feedback">
                      <div v-if="!$v.form.effectiveStartDate.required">Start Date is required.</div>
                      <div
                        v-if="!$v.form.effectiveStartDate.checkDate"
                      >Start date must not be the same or greater than end date</div>
                    </div>
                  </b-form-group>

                  <b-form-group
                    id="endDate"
                    label-cols-sm="3"
                    label="End Date"
                    label-for="input-horizontal"
                  >
                    <datepicker
                      id="endDate"
                      :clear-button="true"
                      :value="datePicker.date"
                      :bootstrap-styling="datePicker.style"
                      :format="datePicker.format"
                      :disabledDates="disabledDates()"
                      :placeholder="datePicker.placeHolder"
                      v-model="form.effectiveEndDate"
                    ></datepicker>
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
                      v-model="$v.form.description.$model"
                      :state="$v.form.description.$dirty ? !$v.form.description.$error : null"
                    ></b-form-textarea>

                    <b-form-invalid-feedback>Description is required</b-form-invalid-feedback>
                  </b-form-group>

                  <h4 class="text-uppercase mt-5">Discount</h4>
                  <hr class="mb-5" />

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
                              class="px-4 mr-3 float-right"
                              variant="primary"
                              v-b-modal.addDiscount
                            >Add</b-button>
                          </b-col>
                        </b-row>
                      </div>

                      <b-table responsive striped :items="discountDetails" :fields="discountFields">
                        <template slot="actions" slot-scope="row">
                          <b-button
                            @click="editDiscountInfo(row.item, row.index)"
                            v-b-modal.editDiscount
                            size="sm"
                            class="px-4"
                            variant="primary"
                          >Edit</b-button>
                          <b-button
                            @click="deleteDiscountInfo(row.index)"
                            v-b-modal.deleteDiscount
                            size="sm"
                            class="px-3 ml-3"
                            variant="danger"
                          >Delete</b-button>
                        </template>
                      </b-table>
                    </div>
                  </b-container>

                  <!-- modal dialog for add discount -->
                  <b-modal
                    id="addDiscount"
                    title="Add Discount"
                    ref="discountDialog"
                    @ok="handleAddDiscount"
                    @hidden="cancelDiscountDialog"
                  >
                    <DiscountForm v-model="form.discount" :v="$v.form.discount"></DiscountForm>
                  </b-modal>

                  <!-- modal dialog for edit discount -->
                  <b-modal
                    id="editDiscount"
                    title="Edit Discount"
                    ref="discountDialog"
                    @ok="handleEditDiscount"
                    @hidden="cancelDiscountDialog"
                  >
                    <DiscountForm v-model="form.discount" :v="$v.form.discount"></DiscountForm>
                  </b-modal>

                  <!-- modal dialog for delete discount -->
                  <b-modal
                    id="deleteDiscount"
                    title="Discount"
                    @ok="handleDeleteDiscount"
                  >Are you sure you want to delete this discount?</b-modal>

                  <h4 class="text-uppercase mt-5">Variation</h4>
                  <hr class="mb-5" />

                  <b-button
                    class="px-4"
                    v-b-modal.addVarient
                    @click="openVarientModal"
                  >+ Add Variant Option</b-button>

                  <!-- modal dialog for varient option -->
                  <b-modal
                    id="addVarient"
                    size="lg"
                    title="Variant Options"
                    ref="varientModal"
                    @ok="handleVarientSubmit"
                    @cancel="cancelVarientDialog"
                    @close="cancelVarientDialog"
                  >
                    <form>
                      <div class="container">
                        <div
                          v-for="(varientSection, varientIndex) in $v.varientSections.$each.$iter"
                          :key="varientIndex"
                        >
                          <b-row>
                            <b-col>
                              <form>
                                <div class="offset-md-1">
                                  <div class="row">
                                    <b-col cols="5">
                                      <b-form-group label="Type" label-for="varientType">
                                        <b-form-input
                                          v-model="varientSection.type.$model"
                                          id="varientType"
                                          :state="varientSection.type.$dirty ? !varientSection.type.$error : null"
                                        ></b-form-input>

                                        <b-form-invalid-feedback>
                                          <p v-if="!varientSection.type.required">Type is required</p>
                                          <p
                                            v-if="!varientSection.type.isDuplicateType"
                                          >There is an existing option with the same type</p>
                                        </b-form-invalid-feedback>
                                      </b-form-group>
                                      <p
                                        class="btn-delete-varient text-danger"
                                        @click="deleteType(varientIndex)"
                                      >Delete Type</p>
                                    </b-col>

                                    <div class="col-6 offset-md-1">
                                      <div
                                        class="row"
                                        v-for="(value, valueIndex) in varientSection.values.$each.$iter"
                                        :key="valueIndex"
                                      >
                                        <div class="col-10">
                                          <b-form-group label="Value" label-for="varientValue">
                                            <b-form-input
                                              id="varientValue"
                                              v-model="value.individualValue.$model"
                                              :state="value.individualValue.$dirty ? !value.individualValue.$error : null"
                                            ></b-form-input>

                                            <b-form-invalid-feedback>
                                              <p
                                                v-if="!value.individualValue.required"
                                              >Value is required</p>
                                              <p
                                                v-if="!value.individualValue.isDuplicateValue"
                                              >There is an existing option with the same value</p>
                                            </b-form-invalid-feedback>
                                          </b-form-group>
                                        </div>

                                        <div class="col-2 col-sm-2">
                                          <b-button
                                            v-if="Object.keys(varientSection.values.$each.$iter).length !== 1"
                                            size="sm"
                                            class="btn-delete-value"
                                            variant="danger"
                                            @click="removeValue(varientIndex, valueIndex)"
                                          >-</b-button>
                                        </div>
                                      </div>
                                      <p
                                        @click="addValue(varientIndex)"
                                        class="btn-add-value text-primary"
                                      >+ Add Another Value</p>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </b-col>
                          </b-row>
                        </div>
                        <b-row>
                          <b-col class="offset-md-1">
                            <b-button
                              variant="outline-primary mt-3"
                              @click="addVarient()"
                            >+ Add Variant Option</b-button>
                          </b-col>
                        </b-row>
                      </div>
                    </form>
                  </b-modal>

                  <div class="text-center" v-if="this.varientTableError">
                    <p
                      v-if="varientDetails.length === 0"
                      class="table-varient-error"
                    >Please add at least one variant option</p>
                    <p
                      v-else
                      class="table-varient-error"
                    >Please fill in all the necessary variant details</p>
                  </div>

                  <b-container class="px-0" fluid>
                    <div class="table-wrapper">
                      <div :class="{'border border-danger' : this.varientTableError}">
                        <div class="table-title">
                          <b-row class="mx-auto">
                            <b-col col-sm="3" class="text-left">
                              <h5>Variants</h5>
                            </b-col>
                          </b-row>
                        </div>

                        <!-- Varient Table -->
                        <b-table responsive striped :items="varientDetails" :fields="varientFields">
                          <template slot="actions" slot-scope="row">
                            <b-button
                              @click="varientInfo(row.item, row.index)"
                              v-b-modal.editVarient
                              size="sm"
                              class="px-4"
                              variant="primary"
                            >Edit</b-button>
                          </template>
                        </b-table>

                        <b-modal
                          id="editVarient"
                          ref="editVarientModal"
                          title="Edit Variant"
                          @ok="editVarientTableDialog"
                          @cancel="cancelEditVarientTableDialog"
                          @close="cancelEditVarientTableDialog"
                          no-close-on-esc
                          no-close-on-backdrop
                        >
                          <form>
                            <b-form-group label="SKU Number">
                              <b-form-input
                                id="productSKU"
                                v-model="$v.form.varient.SKUNumber.$model"
                                :state="$v.form.varient.SKUNumber.$dirty ? !$v.form.varient.SKUNumber.$error : null"
                              ></b-form-input>

                              <b-form-invalid-feedback>
                                <p v-if="!$v.form.varient.SKUNumber.required">SKU Number is required</p>
                                <p
                                  v-if="!$v.form.varient.SKUNumber.isDuplicateSKU"
                                >SKU Number already exist</p>
                              </b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group label="Variant">
                              <b-form-input
                                id="varientCombination"
                                v-model="form.varient.combination"
                                disabled
                              ></b-form-input>
                            </b-form-group>

                            <b-form-group label="Current Qty">
                              <b-form-input
                                id="currentQuantity"
                                v-model="$v.form.varient.currentQuantity.$model"
                                :state="$v.form.varient.currentQuantity.$dirty ? !$v.form.varient.currentQuantity.$error : null"
                              ></b-form-input>

                              <b-form-invalid-feedback>
                                <p
                                  v-if="!$v.form.varient.currentQuantity.required"
                                >Current quantity is required</p>
                                <p
                                  v-if="!$v.form.varient.currentQuantity.integer || !$v.form.varient.currentQuantity.minValue"
                                >Please enter a valid number</p>
                              </b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group label="Min. Qty">
                              <b-form-input
                                id="minimumQuantity"
                                v-model="$v.form.varient.minimumQuantity.$model"
                                :state="$v.form.varient.minimumQuantity.$dirty ? !$v.form.varient.minimumQuantity.$error : null"
                              ></b-form-input>

                              <b-form-invalid-feedback>
                                <p
                                  v-if="!$v.form.varient.minimumQuantity.required"
                                >Minimum quantity is required</p>
                                <p
                                  v-if="!$v.form.varient.minimumQuantity.integer || !$v.form.varient.minimumQuantity.minValue"
                                >Please enter a valid number</p>
                              </b-form-invalid-feedback>
                            </b-form-group>

                            <b-form-group label="Image">
                              <div :class="{'border border-danger' : this.isImageRequired}">
                                <vue-dropzone
                                  id="dropzone"
                                  ref="myVueDropzone"
                                  :options="dropOptions"
                                  :useCustomSlot="true"
                                  @vdropzone-file-added="addFileToDropzone"
                                  @vdropzone-removed-file="deleteFileFromDropzone"
                                  @vdropzone-duplicate-file="duplicateFileCheck"
                                  :destroyDropzone="false"
                                  :duplicateCheck="true"
                                >
                                  <div class="dropzone-custom-content">
                                    <i class="fas fa-cloud-upload-alt fa-3x"></i>
                                    <h4 class="dropzone-custom-title mb-0 mt-3">Drag & Drop</h4>
                                    <div class="subtitle">or click to add your image</div>
                                  </div>
                                </vue-dropzone>
                              </div>
                              <div v-if="this.isImageRequired" class="image-invalid-feedback">
                                <p>Image is required for first varient</p>
                              </div>
                            </b-form-group>
                          </form>

                          <template slot="modal-footer" slot-scope="{ ok, cancel }">
                            <!-- Emulate built in modal footer ok and cancel button actions -->
                            <b-button variant="secondary" @click="cancel()">Cancel</b-button>
                            <b-button
                              variant="primary"
                              @click="ok()"
                              :disabled="varientSubmitLoader"
                            >
                              <b-spinner small class="mr-2" v-if="varientSubmitLoader"></b-spinner>
                              <span>Ok</span>
                            </b-button>
                          </template>
                        </b-modal>
                      </div>
                    </div>
                  </b-container>
                </b-form>

                <div class="text-right">
                  <b-button
                    @click="submitProduct"
                    variant="primary"
                    class="mr-3 px-4"
                    :disabled="productSubmitLoader"
                  >
                    <b-spinner small class="mr-2" v-if="productSubmitLoader" value="save"></b-spinner>
                    <span>Save</span>
                  </b-button>

                  <b-button class="px-4" @click="cancelProduct" :disabled="productCancelLoader">
                    <b-spinner small class="mr-2" v-if="productCancelLoader"></b-spinner>
                    <span>Cancel</span>
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-container>
      </div>
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import vueDropzone from "vue2-dropzone";
import Datepicker from "vuejs-datepicker";
import clonedeep from "lodash.clonedeep"; // Install lodash.clonedeep as a single module
import differencewith from "lodash.differencewith";
import moment from "moment";
import {
  required,
  minValue,
  maxValue,
  decimal,
  integer
} from "vuelidate/lib/validators";
import DiscountForm from "@/components/DiscountForm";
import {
  UPLOAD_PRODUCT_IMAGES,
  DELETE_PRODUCT_IMAGES,
  GET_ONE_PRODUCT,
  UPDATE_ONE_PRODUCT
} from "@/store/actions/product";

export default {
  components: {
    SideBar,
    DashboardHeader,
    vueDropzone,
    Datepicker,
    DiscountForm,
    Footer
  },

  data() {
    return {
      form: {
        productId: null,
        name: "",
        price: null,
        imageHeight: null,
        imageWidth: null,
        effectiveStartDate: "",
        effectiveEndDate: "",
        description: "",
        discount: {
          effectiveStartDate: "",
          effectiveEndDate: "",
          discountValue: "",
          discountType: "Percentage",
          isPercentage: false
        },
        varient: {
          SKUNumber: null,
          varientName: "",
          currentQuantity: null,
          minimumQuantity: null,
          combination: "",
          files: [],
          productImages: [],
          imageCount: ""
        }
      },

      discountFields: [
        { key: "discountValue", label: "Discount" },
        { key: "effectiveStartDate", label: "Start Date" },
        { key: "effectiveEndDate", label: "End Date" },
        { key: "discountType", label: "Discount Type" },
        { key: "actions", label: "Actions" }
      ],

      discountIndex: null,
      discountDetails: [],
      isMaxFixedValue: false,
      isOverlapped: false,
      currentOverlappedDate: "",

      datePicker: {
        style: true,
        format: "yyyy-MM-dd"
      },

      // This is from varient Option
      varientSections: [
        {
          type: "",
          values: [
            {
              id: Math.random()
                .toString(36)
                .substring(7),
              individualValue: ""
            }
          ]
        }
      ],

      hasUserEditVarient: false,
      originalVarient: [],

      varientDetails: [],
      varientTableError: false,
      isImageRequired: false,
      selectedVarientIndex: null,

      deletedImageKeys: [],
      previousDeletedImageKeys: [],
      previousNewImageKeys: [],

      varientFields: [
        { key: "SKUNumber", label: "SKU" },
        {
          key: "attributes",
          label: "Variant",
          thClass: "d-none",
          tdClass: "d-none"
        },
        { key: "combination", label: "Variant" },
        { key: "currentQuantity", label: "Current Qty" },
        { key: "minimumQuantity", label: "Min Qty" },
        { key: "imageCount", label: "Image" },
        { key: "actions", label: "Actions" }
      ],

      // This is similar to configuration options in dropzone.js
      dropOptions: {
        url: "https://httpbin.org/post",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        autoProcessQueue: false,
        thumbnailWidth: 160,
        thumbnailHeight: 160
      },
      isFileDuplicate: false,

      productSubmitLoader: false,
      varientSubmitLoader: false,
      productCancelLoader: false
    };
  },

  validations: {
    form: {
      name: {
        required
      },

      price: {
        required,
        // validate price up to 2 decimal places
        twoDecimal(price) {
          if (price === "") return true;
          let regex = /^\d+(\.\d{1,2})?$/;
          return regex.test(price);
        },
        maxValue: price => (price > 9999.99 && price !== "" ? false : true)
      },

      imageWidth: {
        decimal,
        required,
        minValue: width => (width >= 0 ? true : false)
      },

      imageHeight: {
        decimal,
        required,
        minValue: height => (height >= 0 ? true : false)
      },

      effectiveStartDate: {
        required,
        // Check if start date is equal or greater than end date
        checkDate(startDate) {
          let endDate = this.form.effectiveEndDate;
          if (endDate == "" || endDate == null) return true;

          // Initialize the time to midnight for accurate comparison
          startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
          endDate = new Date(new Date(endDate).setHours(0, 0, 0, 0));

          if (startDate >= endDate) return false;
          return true;
        }
      },

      description: {
        required
      },

      discount: {
        discountValue: {
          required,
          // Validate discount value up to 2 decimal places
          twoDecimal(value) {
            if (value === "" || value < 0 || this.isMaxFixedValue) return true;
            let regex = /^\d+(\.\d{1,2})?$/;
            return regex.test(value);
          },
          // Check if value is greater than 0 and less than or equal to 100 for percentage discount
          maxPercentageValue(value, discountObject) {
            if (value === "") return true;
            if (discountObject.discountType === "Percentage") {
              if (value > 100 || value <= 0) {
                return false;
              }
            }
            return true;
          },
          // Check if base price is larger than discount price and less than or equal to 0 for fixed discount
          maxFixedValue(value, discountObject) {
            if (discountObject.discountType === "Fixed") {
              if (value === "" || this.form.price === "") {
                this.isMaxFixedValue = false;
                return true;
              }
              value = Number(value);
              let basePrice = Number(this.form.price);
              if (value > basePrice || value <= 0) {
                this.isMaxFixedValue = true;
                return false;
              }
            }
            this.isMaxFixedValue = false;
            return true;
          }
        },

        effectiveStartDate: {
          required,
          // Check if discount start date is greater than or equal to discount end date
          checkDate(startDate) {
            if (typeof startDate === "string") return true;
            if (
              this.isOverlapped &&
              this.currentOverlappedDate.getTime() !== startDate.getTime()
            ) {
              this.$v.form.discount.effectiveStartDate.$reset();
            }

            let endDate = this.form.discount.effectiveEndDate;
            if (endDate == "" || endDate == null) return true;
            if (startDate >= this.form.discount.effectiveEndDate) return false;
            return true;
          },

          overlapFound() {
            return !this.isOverlapped;
          },

          // Discount start date must not be lesser than base start date
          checkStartDate(startDate) {
            let discountStartDate = new Date(
              new Date(startDate).setHours(0, 0, 0, 0)
            );
            let baseStartDate = new Date(
              new Date(this.form.effectiveStartDate).setHours(0, 0, 0, 0)
            );
            if (discountStartDate < baseStartDate) {
              return false;
            }
            return true;
          }
        },

        effectiveEndDate: {
          // Discount end date must not be greater than base end date
          checkEndDate(endDate) {
            let discountEndDate = new Date(
              new Date(endDate).setHours(0, 0, 0, 0)
            );
            if (this.form.effectiveEndDate !== null) {
              let baseEndDate = new Date(
                new Date(this.form.effectiveEndDate).setHours(0, 0, 0, 0)
              );
              if (discountEndDate > baseEndDate) {
                return false;
              }
            }
            return true;
          }
        }
      },

      varient: {
        SKUNumber: {
          required,
          // Check if sku number exist in previous varients
          isDuplicateSKU(value) {
            if (value === "") return true;
            let isDuplicate = true;

            if (this.varientDetails.length > 0) {
              this.varientDetails.forEach((varientDetail, index) => {
                if (index !== this.selectedVarientIndex) {
                  if (varientDetail.SKUNumber !== undefined) {
                    if (varientDetail.SKUNumber === value) {
                      isDuplicate = false;
                    }
                  }
                }
              });
            }
            return isDuplicate;
          }
        },

        currentQuantity: {
          required,
          integer,
          minValue: quantity => (quantity >= 0 ? true : false)
        },

        minimumQuantity: {
          required,
          integer,
          minValue: quantity => (quantity >= 0 ? true : false)
        }
      }
    },

    validationGroup: [
      "form.name",
      "form.price",
      "form.imageWidth",
      "form.imageHeight",
      "form.effectiveStartDate",
      "form.description"
    ],

    varientSections: {
      $each: {
        type: {
          required,
          // Check if there is duplicate values for the field "type"
          isDuplicateType(type, varient) {
            if (type === "") return true;

            let foundDuplicate = this.varientSections.find(
              obj => obj.type === type && obj.values !== varient.values
            );

            if (foundDuplicate) {
              return false;
            } else {
              return true;
            }
          }
        },
        values: {
          $each: {
            individualValue: {
              required,
              // Check if there is duplicate values for the field "value"
              isDuplicateValue(varientValue, valueObject) {
                if (varientValue === "") return true;

                let foundDuplicate = this.varientSections.filter(
                  varientSection => {
                    return varientSection.values.some(
                      value =>
                        value.individualValue === varientValue &&
                        value !== valueObject
                    );
                  }
                );

                if (foundDuplicate.length > 0) {
                  return false;
                } else {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  },

  mounted() {
    var productId = localStorage.getItem("updateResourceId");

    this.$store
      .dispatch(GET_ONE_PRODUCT, productId)
      .then(response => {
        // Retrieve all the general information first
        this.form.productId = response.productId;
        this.form.name = response.productName;
        this.form.price = response.price;
        this.form.imageHeight = response.imageHeight;
        this.form.imageWidth = response.imageWidth;
        this.form.effectiveStartDate = response.effectiveStartDate;
        this.form.effectiveEndDate = response.effectiveEndDate;
        this.form.description = response.description;

        // Retrieve the product options and assign it to varient details
        this.varientDetails = response.options.map((option, index) => {
          return {
            productId: response.productId,
            SKUNumber: option.skuNumber,
            optionId: option.optionId,
            attributes: option.attributes.map(attribute => {
              return {
                attributeId: attribute.attributeId,
                type: attribute.attributeType,
                values: {
                  individualValue: attribute.attributeValue
                }
              };
            }),
            files: option.productImages.map(productImage => {
              let fileName = productImage.imageKey;
              let uuid =
                fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
              return {
                upload: {
                  uuid
                },
                size: productImage.imageSize,
                name: productImage.imageKey,
                type: "image/jpeg"
              };
            }),
            imageCount: option.productImages.length,
            currentQuantity: option.currentQuantity,
            minimumQuantity: option.minimumQuantity,
            productImages: option.productImages,
            varientId: index
          };
        });

        let map = new Map();
        response.options.forEach(option => {
          option.attributes.forEach(
            ({ attributeId, attributeType, attributeValue }) => {
              map.has(attributeType) ||
                map.set(attributeType, { type: attributeType, values: [] });
              map.get(attributeType).values.push(attributeValue);
            }
          );
        });

        this.varientSections = [...map.values()];

        // Remove duplicate values. This can be done by creating
        // a set object that lets us store only unique values
        this.varientSections.forEach(varient => {
          varient.values = Array.from(new Set(varient.values));
          varient.values = varient.values.map(value => {
            return {
              individualValue: value,
              id: Math.random()
                .toString(36)
                .substring(7)
            };
          });
        });

        // Get the combination based on varient section
        let varientResults = this.getCombinations();

        // Update this.varientDetails to have the same combination and combineId as varientResults
        varientResults.forEach((varient, index) => {
          this.varientDetails[index].combination = varient.combination;
          this.varientDetails[index].combinedId = varient.combinedId;
        });

        this.discountDetails = response.discountPrice.map(discount => {
          // Attach productId to each discount
          discount.productId = this.form.productId;

          // Attach discountType
          let discountTypeProp = {
            discountType: discount.isPercentage ? "Percentage" : "Fixed"
          };

          // Format start and end date
          discount.effectiveStartDate = moment(
            discount.effectiveStartDate
          ).format("YYYY-MM-DD");

          if (discount.effectiveEndDate !== null) {
            discount.effectiveEndDate = moment(
              discount.effectiveEndDate
            ).format("YYYY-MM-DD");
          }

          // Assign new properties and return
          return Object.assign(discount, discountTypeProp);
        });
      })
      .catch(error => {
        this.message("danger", error.response.data.message);
      });
  },

  methods: {
    // Disable previous dates for end date according to selected start date
    disabledDates() {
      let startDate = this.form.effectiveStartDate;
      if (typeof startDate === "string") {
        startDate = new Date(startDate);
      }
      let disabledDates = {};
      disabledDates.to = new Date(startDate - 8640000);
      return disabledDates;
    },

    handleAddDiscount(bvModalEvt) {
      bvModalEvt.preventDefault();
      const { effectiveStartDate, effectiveEndDate } = this.form.discount;

      if (this.discountDetails.length > 0) {
        // Retrieve all the previous start and end date and convert it to date object
        let discountDates = this.discountDetails.map(
          ({ effectiveStartDate, effectiveEndDate }) => {
            let dateObj = this.convertToDate(
              effectiveStartDate,
              effectiveEndDate
            );
            return {
              effectiveStartDate: dateObj.startDate,
              effectiveEndDate: dateObj.endDate
            };
          }
        );

        // Retrieve the start and end date from the discount form and convert it to date object
        let dateObj = this.convertToDate(effectiveStartDate, effectiveEndDate);

        discountDates.push({
          effectiveStartDate: dateObj.startDate,
          effectiveEndDate: dateObj.endDate
        });

        // Check for date overlap
        let overlapResult = this.overlap(discountDates);

        // If overlap is found, Set boolean to true, which will trigger the error
        // and get the current overlapped date
        if (overlapResult.overlap) {
          this.currentOverlappedDate = effectiveStartDate;
          this.isOverlapped = true;
        } else {
          this.isOverlapped = false;
        }
      } else {
        this.isOverlapped = false;
      }

      // Validate the rest of the discount form
      this.$v.form.discount.$touch();
      if (this.$v.form.discount.$invalid) return;

      // Retrieve the discount object and format the start and end date to string
      let discount = this.form.discount;
      this.formatDiscountDate(discount);

      if (discount.discountType === "Percentage") {
        discount.isPercentage = true;
      } else {
        discount.isPercentage = false;
      }

      discount.productId = this.form.productId;
      this.discountDetails.push(discount);
      this.resetDiscountFields();

      this.$nextTick(() => {
        this.$v.form.discount.$reset();
        this.$refs.discountDialog.hide();
      });
    },

    convertToDate(startDate, endDate) {
      // If the end date is empty, replace it with a large date so that there will always be overlap
      startDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      endDate =
        endDate === "" || endDate === null
          ? new Date(new Date(8640000000000000).setHours(0, 0, 0, 0))
          : new Date(new Date(endDate).setHours(0, 0, 0, 0));
      return {
        startDate,
        endDate
      };
    },

    overlap(dateRanges) {
      var sortedRanges = dateRanges.sort((previous, current) => {
        // get the start date from previous and current
        var previousTime = previous.effectiveStartDate.getTime();
        var currentTime = current.effectiveStartDate.getTime();

        // if the previous is earlier than the current
        if (previousTime < currentTime) {
          return -1;
        }

        // if the previous time is the same as the current time
        if (previousTime === currentTime) {
          return 0;
        }

        // if the previous time is later than the current time
        return 1;
      });

      var result = sortedRanges.reduce(
        (result, current, idx, arr) => {
          // get the previous range
          if (idx === 0) {
            return result;
          }
          var previous = arr[idx - 1];

          // check for any overlap
          var previousEnd = previous.effectiveEndDate.getTime();
          var currentStart = current.effectiveStartDate.getTime();
          var overlap = previousEnd > currentStart;

          // store the specific ranges that overlap and set boolean to true
          if (overlap) {
            result.overlap = true;
            result.ranges.push({
              previous: previous,
              current: current
            });
          }
          return result;
        },
        { overlap: false, ranges: [] }
      );

      // return the final results
      return result;
    },

    // Reset the discount fields and validations when user exits the discount dialog
    cancelDiscountDialog() {
      this.resetDiscountFields();
      this.$v.form.discount.$reset();
    },

    resetDiscountFields() {
      this.form.discount = {
        effectiveStartDate: "",
        effectiveEndDate: "",
        discountValue: "",
        discountType: "Percentage",
        isPercentage: false
      };
      this.isOverlapped = false;
      this.currentOverlappedDate = "";
    },

    // This method is invoked when the edit button is clicked on the "discount table"
    editDiscountInfo(discount, index) {
      // Get the index (row) and discount object selected
      this.form.discount = Object.assign({}, discount);
      this.discountIndex = index;
    },

    // This method is invoked when the OK button is clicked on the "modal dialog" (Save the changes)
    handleEditDiscount(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.$v.form.discount.$touch();

      const { effectiveStartDate, effectiveEndDate } = this.form.discount;

      if (this.discountDetails.length > 0) {
        // Retrieve all the previous start and end date and convert it to date object
        let discountDates = this.discountDetails
          .filter(({ effectiveStartDate, effectiveEndDate }, index) => {
            // Do not retrieve the start and end date for current row (index)
            if (index === this.discountIndex) {
              return false;
            }
            return true;
          })
          .map(({ effectiveStartDate, effectiveEndDate }) => {
            let dateObj = this.convertToDate(
              effectiveStartDate,
              effectiveEndDate
            );
            return {
              effectiveStartDate: dateObj.startDate,
              effectiveEndDate: dateObj.endDate
            };
          });

        // Retrieve the start and end date from the discount form and convert it to date object
        let dateObj = this.convertToDate(effectiveStartDate, effectiveEndDate);

        discountDates.push({
          effectiveStartDate: dateObj.startDate,
          effectiveEndDate: dateObj.endDate
        });

        // Check for date overlap
        let overlapResult = this.overlap(discountDates);

        // If overlap is found, set boolean to true and get the current overlapped date
        if (overlapResult.overlap) {
          this.currentOverlappedDate = effectiveStartDate;
          this.isOverlapped = true;
        } else {
          this.currentOverlappedDate = "";
          this.isOverlapped = false;
        }
      } else {
        this.currentOverlappedDate = "";
        this.isOverlapped = false;
      }

      // Validate discount form
      if (this.$v.form.discount.$invalid) return;

      // Retrieve the discount object and format the start and end date to string
      let discount = this.form.discount;
      let index = this.discountIndex;
      this.formatDiscountDate(discount);

      if (discount.discountType === "Percentage") {
        discount.isPercentage = true;
      } else {
        discount.isPercentage = false;
      }

      // Update the discount object based on the index in the array
      this.$set(this.discountDetails, index, discount);

      // Once updated, remove the values in the field
      this.resetDiscountFields();

      this.$nextTick(() => {
        this.$v.form.discount.$reset();
        this.$refs.discountDialog.hide();
      });
    },

    deleteDiscountInfo(index) {
      this.discountIndex = index;
    },

    handleDeleteDiscount() {
      // Delete discount object based on the index
      this.discountDetails.splice(this.discountIndex, 1);
    },

    // Format the date object to string
    formatDiscountDate(discount) {
      let { effectiveStartDate, effectiveEndDate } = this.form.discount;
      discount.effectiveStartDate = moment(effectiveStartDate).format(
        "YYYY-MM-DD"
      );
      // If end date is null or empty, do not format
      if (effectiveEndDate !== "" && effectiveEndDate !== null) {
        discount.effectiveEndDate = moment(effectiveEndDate).format(
          "YYYY-MM-DD"
        );
      }
    },

    addVarient() {
      this.$nextTick(() => {
        this.varientSections.length === 1
          ? this.$v.varientSections.$reset()
          : null;
      });

      // Assign a unique Id for each value field. This will be used to keep
      // track of what is added, deleted or updated later on
      this.varientSections.push({
        type: "",
        values: [
          {
            id: Math.random()
              .toString(36)
              .substring(7),
            individualValue: ""
          }
        ]
      });
    },

    addValue(varientIndex) {
      this.varientSections[varientIndex].values.push({
        id: Math.random()
          .toString(36)
          .substring(7),
        individualValue: ""
      });
    },

    removeValue(varientIndex, valueIndex) {
      this.varientSections[varientIndex].values.splice(valueIndex, 1);
    },

    deleteType(index) {
      this.varientSections.splice(index, 1);
    },

    handleVarientSubmit(bvModalEvt) {
      bvModalEvt.preventDefault();
      // Validate fields
      this.$v.varientSections.$touch();
      if (this.$v.varientSections.$invalid) return;
      this.handleSubmit();
    },

    // This method is invoked when user clicked on the "OK" button on the varient option modal dialog
    handleSubmit() {
      if (this.varientSections.length !== 0) {
        // Calculate and return the combinations for each varient type and value
        let varientResults = this.getCombinations(this.varientSections);

        // Find the combination based on the combine Id between this.varientDetails and varientResult
        // Do note that, this.varientDetails is an array of varient object from the "varient" table
        varientResults.forEach((varientResult, index) => {
          let varientDetail = this.varientDetails.find(
            vd => vd.combinedId === varientResult.combinedId
          );

          // If the combination is found, update it while retaining
          // the product details such as sku, quantity and etc (if any)
          if (varientDetail !== undefined) {
            let newCombination = varientResult.combination;
            let newAttributes = varientResult.attributes;
            varientResult = varientDetail;

            // Update the combination as well as the attributes that contains the type and value
            varientResult.combination = newCombination;
            varientResult.attributes = newAttributes;
            varientResults[index] = varientResult;
          }
        });

        // Loop through the old list (this.varientDetails), If can't be found in the new list
        // it means that the images were deleted
        this.varientDetails.forEach(vd => {
          // If combination is not found in the new list, it means that it is deleted
          const index = varientResults.findIndex(
            vr => vr.combination === vd.combination
          );

          if (index === -1) {
            if (vd.productImages !== undefined) {
              vd.productImages.forEach(image => {
                if (image.isNew !== undefined) {
                  this.previousNewImageKeys.push(image.imageKey);
                }
                // Check to see if deleted image is arleady present in the deletedImageKeys array
                const deletedIndex = this.deletedImageKeys.findIndex(
                  deletedImage => deletedImage === image.imageKey
                );
                if (deletedIndex === -1) {
                  this.deletedImageKeys.push(image.imageKey);
                }
              });
            }
          }
        });

        this.varientDetails = varientResults;
        this.varientTableError = false;
      } else {
        this.varientTableError = true;
        this.varientDetails = [];
      }

      // Reset validation and hide modal dialog
      this.$nextTick(() => {
        this.$v.varientSections.$reset();
        this.$refs.varientModal.hide();
      });
    },

    getCombinations() {
      const getCartesian = function(object) {
        return Object.entries(object).reduce(
          (r, [key, value]) => {
            let temp = [];
            r.forEach(s =>
              (Array.isArray(value) ? value : [value]).forEach(w =>
                (w && typeof w === "object" ? getCartesian(w) : [w]).forEach(
                  x => temp.push({ ...s, [key]: x })
                )
              )
            );
            return temp;
          },
          [{}]
        );
      };

      let varientResults = getCartesian(this.varientSections).map(o => {
        return {
          attributes: Object.assign([], o).map(attrs => attrs)
        };
      });

      varientResults.forEach(vr => {
        let combinedId = "";
        let combination = "";
        // Loop through each combination to perform the following tasks:
        // 1. Create a new property called combination (black matte)
        // 2. Create a new property called combineId, which is a combination
        // of the unique Id for each combination (hydzmn2b0dd9)
        vr.attributes.forEach(attri => {
          combinedId += attri.values.id;
          combination += attri.values.individualValue + " ";
        });
        vr.combinedId = combinedId;
        vr.combination = combination;
      });

      return varientResults;
    },

    cancelVarientDialog() {
      // If user previously never save any varient options,
      // reset the values when the modal dialog is cancelled
      if (this.varientDetails.length === 0) {
        this.varientSections = [
          {
            type: "",
            values: [
              {
                id: Math.random()
                  .toString(36)
                  .substring(7),
                individualValue: ""
              }
            ]
          }
        ];
      } else {
        this.varientSections = clonedeep(this.originalVarient);
      }

      // reset validation and hide modal dialog
      this.$nextTick(() => {
        this.$v.varientSections.$reset();
        this.$refs.varientModal.hide();
      });
    },

    openVarientModal() {
      // Clone the array so that it does not contain reference to original array
      this.originalVarient = clonedeep(this.varientSections);
    },

    // This method is invoked when the "edit" button is clicked on the "varient table"
    varientInfo(varient, index) {
      this.selectedVarientIndex = index;
      this.previousDeletedImageKeys = Object.assign([], this.deletedImageKeys);

      if (varient.SKUNumber == null) {
        // Display the combination in the "varient" input field
        this.form.varient.combination = varient.combination;
      } else {
        // Get the varient object selected and display images in dropzone (if any)
        this.form.varient = clonedeep(varient);

        setTimeout(() => {
          this.form.varient.files.forEach(file => {
            var index = this.form.varient.productImages.findIndex(
              image => image.imageKey === file.upload.uuid + ".jpg"
            );

            if (index > -1) {
              var fileProperty = {
                size: file.size,
                name: file.name,
                type: file.type
              };

              this.$refs.myVueDropzone.manuallyAddFile(
                fileProperty,
                this.form.varient.productImages[index].imageUrl
              );
            }
          });
        }, 100);
      }
    },

    // This method is invoked once the user click the OK button on the edit varient modal dialog
    editVarientTableDialog(bvModalEvt) {
      bvModalEvt.preventDefault();

      let index = this.selectedVarientIndex;
      if (index === 0) {
        if (this.form.varient.files.length === 0) {
          this.isImageRequired = true;
        }
      }

      // Check if the fields are invalid
      this.$v.form.varient.$touch();
      if (this.$v.form.varient.$invalid || this.isImageRequired) return;

      this.varientSubmitLoader = true;

      // Check if there is any changes between the old and new list
      let newImages = differencewith(
        this.form.varient.files,
        this.varientDetails[index].files
      );

      // Keep the objects in the array that has the dataURL value as it signifies a new file.
      newImages = newImages.filter(fd => {
        return fd.dataURL !== undefined;
      });

      // Remember to remove it at import as well
      if (newImages.length > 0) {
        this.uploadImages(newImages);
      } else {
        this.updateVarientTable(this.form.varient);
      }
    },

    uploadImages(newImages) {
      const formData = new FormData();
      for (var i = 0; i < newImages.length; i++) {
        formData.append("imageFiles[" + i + "].ImageFile.File", newImages[i]);
        formData.append(
          "imageFiles[" + i + "].ImageKey",
          newImages[i].upload.uuid + ".jpg"
        );
      }

      this.$store
        .dispatch(UPLOAD_PRODUCT_IMAGES, formData)
        .then(response => {
          response.productImages.forEach((productImage, index) => {
            // Attach a property called isNew, which is used to signify
            // that this image have not been saved to the database
            this.form.varient.productImages.push({
              isNew: true,
              imageKey: productImage.imageKey,
              imageUrl: productImage.imageUrl,
              imageSize: newImages[index].size
            });
          });
          this.updateVarientTable(this.form.varient);
        })
        .catch(error => {
          this.message("danger", error.response.data.message);
          this.varientSubmitLoader = false;
        });
    },

    updateVarientTable(varient) {
      varient.imageCount = varient.files.length;
      let index = this.selectedVarientIndex;

      // Loop through the array to find out which varient object the user edited.
      // Once found, update the details based on the varient
      this.varientDetails = this.varientDetails.map(el => {
        if (el.combination === varient.combination) {
          return Object.assign(el, varient);
        }
        return el;
      });

      // Once updated, remove the values in the field
      this.form.varient = {
        SKUNumber: null,
        varientName: "",
        currentQuantity: null,
        minimumQuantity: null,
        combination: "",
        type: "",
        value: "",
        files: [],
        productImages: []
      };

      this.varientSubmitLoader = false;
      this.varientTableError = false;

      this.$nextTick(() => {
        this.$v.form.varient.$reset();
        this.$refs.editVarientModal.hide();
      });
    },

    // This method will be invoked when the cancel or x button is clicked on the varient modal dialog
    cancelEditVarientTableDialog() {
      this.form.varient = {
        SKUNumber: null,
        varientName: "",
        currentQuantity: null,
        minimumQuantity: null,
        combination: "",
        type: "",
        value: "",
        files: [],
        productImages: []
      };
      this.isImageRequired = false;
      this.$v.form.varient.$reset();
      this.deletedImageKeys = Object.assign([], this.previousDeletedImageKeys);
    },

    duplicateFileCheck(file) {
      this.isFileDuplicate = true;
    },

    addFileToDropzone(file) {
      if (file.manuallyAdded !== true && this.isFileDuplicate !== true) {
        this.form.varient.files.push(file);
      }
      this.isImageRequired = false;
      this.isFileDuplicate = false;
    },

    deleteFileFromDropzone(file) {
      // Remove the deleted file from the array that have not yet been uploaded to S3
      if (file.manuallyAdded !== true) {
        this.form.varient.files = this.form.varient.files.filter(
          el => el.upload.uuid != file.upload.uuid
        );
      } else {
        // Remove the deleted file from the array
        this.form.varient.files = this.form.varient.files.filter(
          el => el.name !== file.name && el.size !== file.size
        );

        this.form.varient.productImages.forEach(image => {
          let parts = image.imageKey.split(".");
          let uuid = parts[0];

          // Check to see if uuid is present in the deletedImageKeys array
          const deletedIndex = this.deletedImageKeys.findIndex(
            image => image === uuid + ".jpg"
          );

          // If it is not present, carry on
          if (deletedIndex === -1) {
            const index = this.form.varient.files.findIndex(
              file => file.upload.uuid === uuid
            );
            if (index === -1) {
              this.deletedImageKeys.push(uuid + ".jpg");
            }
          }
        });
      }
    },

    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    // Delete images from S3 once user cancel the product
    cancelProduct() {
      let deletedImageKeys = [];
      this.varientDetails.forEach(varientDetail => {
        if (varientDetail.productImages !== undefined) {
          varientDetail.productImages.forEach(productImage => {
            if (productImage.isNew !== undefined) {
              deletedImageKeys.push(productImage.imageKey);
            }
          });
        }
      });

      // If there are images of previously deleted varients, we will concat it
      // with the images in the current varient and delete them from S3
      if (this.previousNewImageKeys.length > 0) {
        deletedImageKeys = this.previousNewImageKeys.concat(deletedImageKeys);
      }

      if (deletedImageKeys.length > 0) {
        this.$store
          .dispatch(DELETE_PRODUCT_IMAGES, deletedImageKeys)
          .then(response => {
            this.message("success", response.message);
            this.$router.push("/ResourceManagement");
          })
          .catch(error => {
            this.message("danger", error.response.data.message);
            this.cancelLoader = false;
          });
      } else {
        this.$router.push("/ResourceManagement");
      }
    },

    submitProduct(event) {
      this.$v.validationGroup.$touch();

      // If varientDetails is empty set boolean to true which will trigger an error message
      if (this.varientDetails.length === 0) {
        this.varientTableError = true;
      } else {
        for (let i = 0; i < this.varientDetails.length; i++) {
          // If sku number is undefined, trigger error
          if (this.varientDetails[i].SKUNumber === undefined) {
            this.varientTableError = true;
            break;
          }
        }
      }

      if (this.$v.validationGroup.$invalid || this.varientTableError) {
        return;
      }

      const { varientDetails, discountDetails, form } = this;

      form.effectiveStartDate = moment(form.effectiveStartDate).format(
        "YYYY-MM-DD"
      );

      // If end date is null or empty, do not format
      if (form.effectiveEndDate !== "" && form.effectiveEndDate !== null) {
        form.effectiveEndDate = moment(form.effectiveEndDate).format(
          "YYYY-MM-DD"
        );
      }

      // construct an object that holds all the product details
      let productObj = {
        productId: form.productId,
        productName: form.name,
        description: form.description,
        Price: form.price,
        ImageWidth: form.imageWidth,
        ImageHeight: form.imageHeight,
        EffectiveStartDate: form.effectiveStartDate,
        EffectiveEndDate: form.effectiveEndDate,
        DiscountPrices: discountDetails
      };

      console.dir(productObj);

      this.productSubmitLoader = true;

      if (this.deletedImageKeys.length > 0) {
        this.$store
          .dispatch(DELETE_PRODUCT_IMAGES, this.deletedImageKeys)
          .then(response => {
            // Filter and return the array of productImages that does not contain the deleted key
            this.varientDetails = this.varientDetails.map(varientDetail => {
              varientDetail.productImages = varientDetail.productImages.filter(
                image => {
                  return !this.deletedImageKeys.includes(image.imageKey);
                }
              );
              return varientDetail;
            });
            productObj.options = this.getOptions();
            this.updateProduct(productObj);
          })
          .catch(error => {
            this.productSubmitLoader = false;
            this.message("danger", error.response.data.message);
          });
      } else {
        productObj.options = this.getOptions();
        this.updateProduct(productObj);
      }
    },

    getOptions() {
      return this.varientDetails.map((varient, index) => {
        return {
          productId: this.form.productId,
          skuNumber: varient.SKUNumber,
          currentQuantity: varient.currentQuantity,
          minimumQuantity: varient.minimumQuantity,
          optionId: varient.optionId,
          // Attach the optionId for each object in the array "attributes" and "productImages"
          attributes: varient.attributes.map(atr => {
            return {
              optionId: varient.optionId,
              attributeId: atr.attributeId,
              attributeType: atr.type,
              attributeValue: atr.values.individualValue
            };
          }),
          productImages: varient.productImages.map(image => {
            image.optionId = varient.optionId;
            return image;
          })
        };
      });
    },

    updateProduct(productObj) {
      this.$store
        .dispatch(UPDATE_ONE_PRODUCT, productObj)
        .then(response => {
          this.message("success", response.message);
          this.productSubmitLoader = false;
          this.$router.push("/ResourceManagement");
        })
        .catch(error => {
          this.message("danger", error.response.data.message);
          this.productSubmitLoader = false;
        });
    }
  }
};
</script>

<style>
</style>
