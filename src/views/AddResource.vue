<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <div id="content-wrapper">
      <div id="content">
        <DashboardHeader title="Resource Management - Add Resource"></DashboardHeader>

        <b-container fluid>
          <b-row class="bg-white text-left" align-h="center">
            <b-col cols="10" class="my-5">
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
                    <p v-if="!$v.form.price.maxValue">Price cannot exceed more than 999</p>
                  </b-form-invalid-feedback>
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
                    :disabledDates="datePicker.disabledDates"
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
                    :disabledDates="datePicker.disabledDates"
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
                            id="add-discount"
                            class="px-4 float-right"
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
                >+ Add Varient Option</b-button>

                <!-- <span>Test</span> -->

                <!-- modal dialog for varient option -->
                <b-modal
                  id="addVarient"
                  size="lg"
                  title="Varient Options"
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
                          >+ Add Varient Option</b-button>
                        </b-col>
                      </b-row>
                    </div>
                  </form>
                </b-modal>
                <div class="text-center" v-if="this.varientTableError">
                  <p
                    v-if="varientDetails.length === 0"
                    class="table-varient-error"
                  >Please add at least one varient option</p>
                  <p
                    v-else
                    class="table-varient-error"
                  >Please fill in all the necessary varient details</p>
                </div>
                <b-container class="px-0" fluid>
                  <div class="table-wrapper">
                    <!-- :class="{'border border-danger' : this.varientTableError}" -->
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
                        title="Edit Varient"
                        @ok="editVarientTableDialog"
                        @hidden="cancelEditVarientTableDialog"
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

                          <b-form-group label="Varient">
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
                          </b-form-group>
                        </form>

                        <template slot="modal-footer" slot-scope="{ ok, cancel }">
                          <!-- Emulate built in modal footer ok and cancel button actions -->
                          <b-button variant="secondary" @click="cancel()">Cancel</b-button>
                          <b-button variant="primary" @click="ok()" :disabled="varientSubmitLoader">
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
                  :disabled="submitLoader"
                >
                  <b-spinner small class="mr-2" v-if="submitLoader"></b-spinner>
                  <span>Save</span>
                </b-button>

                <b-button class="px-4" @click="cancelProduct">
                  <b-spinner small class="mr-2" v-if="cancelLoader"></b-spinner>
                  <span>Cancel</span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";
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
  UPLOAD_AND_DELETE_PRODUCT_IMAGES,
  CREATE_PRODUCT
} from "@/store/actions/product";

export default {
  components: {
    SideBar,
    DashboardHeader,
    vueDropzone,
    Datepicker,
    DiscountForm
  },

  data() {
    return {
      form: {
        name: "",
        price: "",
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
          productImages: []
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
        format: "yyyy-MM-dd",
        disabledDates: {
          to: new Date(Date.now() - 8640000)
        }
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
      selectedVarientIndex: null,
      deletedImageKeys: [],
      // Used to store images of deleted varient
      previousDeletedImageKeys: [],

      varientFields: [
        { key: "SKUNumber", label: "SKU" },
        {
          key: "attributes",
          label: "Varient",
          thClass: "d-none",
          tdClass: "d-none"
        },
        { key: "combination", label: "Varient" },
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

      submitLoader: false,
      varientSubmitLoader: false,
      cancelLoader: false
    };
  },

  validations: {
    form: {
      name: {
        required
      },

      price: {
        required,
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
        checkDate(startDate) {
          if (typeof startDate === "string") return true;

          let endDate = this.form.effectiveEndDate;
          if (endDate == "" || endDate == null) return true;
          console.log(startDate);
          console.log(endDate);
          // Initialize the time to midnight for accurate comparison
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

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
          twoDecimal(value) {
            if (value === "" || value < 0 || this.isMaxFixedValue) return true;
            let regex = /^\d+(\.\d{1,2})?$/;
            return regex.test(value);
          },
          maxPercentageValue(value, discountObject) {
            if (value === "") return true;
            if (discountObject.discountType === "Percentage") {
              if (value > 100 || value <= 0) {
                return false;
              }
            }
            return true;
          },
          maxFixedValue(value, discountObject) {
            if (discountObject.discountType === "Fixed") {
              if (value === "" || this.form.price === "") {
                this.isMaxFixedValue = false;
                return true;
              }
              value = Number(value);
              let price = Number(this.form.price);
              if (value > price || value <= 0) {
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
            if (startDate > this.form.discount.effectiveEndDate) return false;
            return true;
          },
          overlapFound() {
            return !this.isOverlapped;
          }
        }
      },

      varient: {
        SKUNumber: {
          required,
          isDuplicateSKU(value) {
            if (value === "") return true;
            let isDuplicate = true;

            if (this.varientDetails.length > 0) {
              this.varientDetails.forEach(varientDetail => {
                if (varientDetail.SKUNumber !== undefined) {
                  if (varientDetail.SKUNumber === value) {
                    isDuplicate = false;
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
          isDuplicateType(type, varient) {
            if (type === "") return true;

            // Check if there is duplicate values for the field "type".
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
              isDuplicateValue(varientValue, valueObject) {
                if (varientValue === "") return true;

                // Check if there is duplicate values for the field "type".
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

  methods: {
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

        // If overlap is found, Set boolean to true and get the current overlapped date
        if (overlapResult.overlap) {
          this.currentOverlappedDate = effectiveStartDate;
          this.isOverlapped = true;
        } else {
          this.isOverlapped = false;
        }
      } else {
        this.isOverlapped = false;
      }

      // Validate discount form
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
          var overlap = previousEnd >= currentStart;

          // // store the specific ranges that overlap and set boolean to true
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

    // Reset the discount object when user exits the discount dialog and the validation
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
      console.log(index);
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

        // If overlap is found, Set boolean to true and get the current overlapped date
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
      console.log(this.discountDetails);
    },

    formatDiscountDate(discount) {
      let { effectiveStartDate, effectiveEndDate } = this.form.discount;
      discount.effectiveStartDate = moment(effectiveStartDate).format(
        "YYYY-MM-DD"
      );
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

      console.log(this.varientSections);

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

        // previousDeletedImageKeys:

        this.varientDetails.forEach(vd => {
          const index = varientResults.findIndex(
            vr => vr.combination === vd.combination
          );

          if (index === -1) {
            if (vd.productImages !== undefined) {
              vd.productImages.forEach(image => {
                this.previousDeletedImageKeys.push(image.imageKey);
              });
            }
          }
        });

        console.log(this.previousDeletedImageKeys);

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

    getCombinations(varientSections) {
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

      let varientResults = getCartesian(varientSections).map(o => {
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

      // Check if the fields are invalid
      this.$v.form.varient.$touch();
      if (this.$v.form.varient.$invalid) return;

      let index = this.selectedVarientIndex;
      this.varientSubmitLoader = true;

      // Check if there is any changes between the old and new list
      const newImages = differencewith(
        this.form.varient.files,
        this.varientDetails[index].files
      );

      // The following condition will be called if new image(s) were added and deleted from the dropzone
      if (newImages.length > 0 && this.deletedImageKeys.length > 0) {
        this.uploadAndDeleteImages(newImages);
      } else {
        // The following condition will be called if new image(s) were added to the dropzone
        if (newImages.length > 0) {
          this.uploadImages(newImages);
        }
        // The following condition will be called if image(s) were deleted from the dropzone
        else if (this.deletedImageKeys.length > 0) {
          this.deleteImages();
        } else {
          this.updateVarientTable(this.form.varient);
        }
      }
    },

    uploadAndDeleteImages(newImages) {
      const formData = new FormData();
      for (var i = 0; i < newImages.length; i++) {
        formData.append("imageFiles[" + i + "].ImageFile.File", newImages[i]);
        formData.append(
          "imageFiles[" + i + "].ImageKey",
          newImages[i].upload.uuid + ".jpg"
        );
      }

      let guids = this.deletedImageKeys;
      let obj = {
        formData,
        guids
      };

      this.$store
        .dispatch(UPLOAD_AND_DELETE_PRODUCT_IMAGES, obj)
        .then(response => {
          // Get the imageKey, imageUrl and imageSize and push it to the productImages array
          response[0].productImages.forEach((productImage, index) => {
            this.form.varient.productImages.push({
              imageKey: productImage.imageKey,
              imageUrl: productImage.imageUrl,
              imageSize: newImages[index].size
            });
          });

          // Filter and return the array of productImages that does not contain the deleted guid
          this.form.varient.productImages = this.form.varient.productImages.filter(
            image => !guids.includes(image.imageKey)
          );

          this.updateVarientTable(this.form.varient);
        })
        .catch(error => {
          console.dir(error);
          alert("error");
          this.varientSubmitLoader = false;
        });
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
          console.dir(response);
          response.productImages.forEach((productImage, index) => {
            this.form.varient.productImages.push({
              imageKey: productImage.imageKey,
              imageUrl: productImage.imageUrl,
              imageSize: newImages[index].size
            });
            console.log(this.form.varient.productImages);
          });

          console.log("add done called");
          console.log(this.form.varient);
          console.log(this.form.varient.productImages);
          this.updateVarientTable(this.form.varient);
        })
        .catch(error => {
          console.dir(error);
          alert("error");
          this.varientSubmitLoader = false;
        });
    },

    deleteImages() {
      this.$store
        .dispatch(DELETE_PRODUCT_IMAGES, this.deletedImageKeys)
        .then(response => {
          console.dir(response);
          console.log(this.form.varient);

          // Filter and return the array of productImages that does not contain the deleted guid
          this.form.varient.productImages = this.form.varient.productImages.filter(
            image => !this.deletedImageKeys.includes(image.imageKey)
          );

          console.log(this.form.varient);
          console.log("delete done called");
          this.updateVarientTable(this.form.varient);
        })
        .catch(error => {
          console.dir(error);
          alert("error");
        });
    },

    updateVarientTable(varient) {
      varient.imageCount = varient.productImages.length;
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

      this.deletedImageKeys = [];
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
      this.$v.form.varient.$reset();
      this.deletedImageKeys = [];
    },

    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    duplicateFileCheck(file) {
      this.isFileDuplicate = true;
    },

    addFileToDropzone(file) {
      console.log(file);
      if (file.manuallyAdded !== true && this.isFileDuplicate !== true) {
        // Add the user upload file into the array
        console.log("Added file into files array ");
        this.form.varient.files.push(file);
        console.dir(this.form.varient.files);
      }
      console.log(this.form.varient);
      this.isFileDuplicate = false;
    },

    deleteFileFromDropzone(file) {
      console.log("delete called");
      console.log(file);
      // Remove the deleted file from the array by checking the uuid
      if (file.manuallyAdded !== true) {
        this.form.varient.files = this.form.varient.files.filter(
          el => el.upload.uuid != file.upload.uuid
        );
      } else {
        // Remove manuallyAdded file from the array by checking it against the name and size
        this.form.varient.files = this.form.varient.files.filter(
          el => el.name !== file.name && el.size !== file.size
        );

        // Find out which image was deleted by comparing the uuid with the
        // productImages and form.varient.file
        this.form.varient.productImages.forEach(image => {
          let parts = image.imageKey.split(".");
          let uuid = parts[0];
          console.log(uuid);

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
        console.log(this.deletedImageKeys);
        console.log(this.form.varient.productImages);
        console.log(this.varientDetails[this.selectedVarientIndex]);
      }
    },

    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    // Delete images in S3 once user cancel the product
    cancelProduct() {
      let deleteKeys = [];
      this.varientDetails.forEach(varientDetail => {
        if (varientDetail.productImages !== undefined) {
          varientDetail.productImages.forEach(image => {
            deleteKeys.push(image.imageKey);
          });
        }
      });

      // If there are images from deleted varient(s), we will concat it with the images
      // from the current varient
      if (this.previousDeletedImageKeys.length > 0) {
        deleteKeys = this.previousDeletedImageKeys.concat(deleteKeys);
      }

      console.log(deleteKeys);

      if (deleteKeys.length > 0) {
        this.cancelLoader = true;
        this.$store
          .dispatch(DELETE_PRODUCT_IMAGES, deleteKeys)
          .then(response => {
            alert("successfully deleted all images");
            console.dir(response);
            this.cancelLoader = false;
          })
          .catch(error => {
            console.dir(error);
            alert("error");
            this.cancelLoader = false;
          });
      }
    },

    submitProduct() {
      this.$v.validationGroup.$touch();

      if (this.varientDetails.length === 0) {
        this.varientTableError = true;
      } else {
        for (let i = 0; i < this.varientDetails.length; i++) {
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
      this.submitLoader = true;

      form.effectiveStartDate = moment(form.effectiveStartDate).format(
        "YYYY-MM-DD"
      );
      if (form.effectiveEndDate !== "" && form.effectiveEndDate !== null) {
        form.effectiveEndDate = moment(form.effectiveEndDate).format(
          "YYYY-MM-DD"
        );
      }

      var productObj = {
        productName: form.name,
        description: form.description,
        Price: form.price,
        ImageWidth: form.imageWidth,
        ImageHeight: form.imageHeight,
        EffectiveStartDate: form.effectiveStartDate,
        EffectiveEndDate: form.effectiveEndDate,
        DiscountPrices: discountDetails,
        options: this.getOptions()
      };

      console.log(productObj);

      this.$store
        .dispatch(CREATE_PRODUCT, productObj)
        .then(response => {
          console.dir(response);
          this.submitLoader = false;
          this.message("success", "You have successfully added a new product!");
          // this.$router.push("/ResourceManagement");
        })
        .catch(error => {
          console.dir(error);
          this.message("danger", error.response.data.message);
          this.submitLoader = false;
        });
    },

    getOptions() {
      return this.varientDetails.map((varient, index) => {
        return {
          skuNumber: varient.SKUNumber,
          currentQuantity: varient.currentQuantity,
          minimumQuantity: varient.minimumQuantity,
          attributes: varient.attributes.map(atr => {
            return {
              attributeType: atr.type,
              attributeValue: atr.values.individualValue
            };
          }),
          productImages: varient.productImages
        };
      });
    }
  }
};
</script>

<style>
h4 {
  color: #6a6c78;
}

.date-invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #e74a3b;
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

.dz-progress {
  /* Removes progress bar since we are not uploading it immediately */
  display: none !important;
}

.varient-column {
  display: inline-block;
}

.varient-column span {
  margin: 3px;
}

.table {
  margin-bottom: 0 !important;
}

#add-discount {
  margin-right: 63px;
}

.vdp-datepicker .input-group .form-control[readonly] {
  background: none !important;
}

.radio-button .active {
  color: #fff !important;
  background-color: #28a745 !important;
  border-color: #28a745 !important;
}

.btn-outline-secondary {
  border-color: #d1d3e2 !important;
}

.table-varient-error {
  background-color: #fae7ec;
  padding: 10px;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  margin-top: 40px;
}
</style>
