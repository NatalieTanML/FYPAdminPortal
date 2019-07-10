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
                <!-- b-form-group is a wrapper that helps to support labels, help text and feedback -->
                <b-form-group
                  id="productName"
                  label-cols-sm="3"
                  label="Product Name"
                  label-for="input-horizontal"
                >
                  <b-form-input id="productName" v-model="form.name"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="price"
                  label-cols-sm="3"
                  label="Price"
                  label-for="input-horizontal"
                >
                  <b-form-input id="price" v-model="form.price"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="imageWidth"
                  label-cols-sm="3"
                  label="Width"
                  label-for="input-horizontal"
                >
                  <b-form-input id="imageWidth" v-model="form.imageWidth"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="imageHeight"
                  label-cols-sm="3"
                  label="Height"
                  label-for="input-horizontal"
                >
                  <b-form-input id="imageHeight" v-model="form.imageHeight"></b-form-input>
                </b-form-group>

                <b-form-group
                  id="startDate"
                  label-cols-sm="3"
                  label="Start Date"
                  label-for="input-horizontal"
                >
                  <datepicker
                    id="startDate"
                    :value="datePicker.date"
                    :bootstrap-styling="datePicker.style"
                    :format="datePicker.format"
                    :placeholder="datePicker.placeHolder"
                    v-model="form.effectiveStartDate"
                    required
                  ></datepicker>
                </b-form-group>

                <b-form-group
                  id="endDate"
                  label-cols-sm="3"
                  label="End Date"
                  label-for="input-horizontal"
                >
                  <datepicker
                    id="endDate"
                    :value="datePicker.date"
                    :bootstrap-styling="datePicker.style"
                    :format="datePicker.format"
                    :placeholder="datePicker.placeHolder"
                    v-model="form.effectiveEndDate"
                    required
                  ></datepicker>
                </b-form-group>

                <b-form-group
                  id="description"
                  label-cols-sm="3"
                  label="Description"
                  label-for="input-horizontal"
                >
                  <b-form-textarea id="description" rows="6" v-model="form.description"></b-form-textarea>
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
                  title="Discount"
                  @ok="handleAddDiscount"
                  @close="cancelDiscountDialog"
                  @cancel="cancelDiscountDialog"
                >
                  <DiscountForm v-model="this.form"></DiscountForm>
                </b-modal>

                <!-- modal dialog for edit discount -->
                <b-modal
                  id="editDiscount"
                  title="Discount"
                  @ok="handleEditDiscount"
                  @close="cancelDiscountDialog"
                  @cancel="cancelDiscountDialog"
                >
                  <DiscountForm v-model="this.form"></DiscountForm>
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

                <!-- modal dialog for varient option -->
                <b-modal
                  id="addVarient"
                  size="lg"
                  title="Varient Options"
                  ref="varientModal"
                  @ok="handleVarientSubmit"
                  @cancel="cancel"
                  @close="cancel"
                >
                  <form @submit.stop.prevent="submitDiscount">
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
                                      </b-form-invalid-feedback>
                                    </b-form-group>
                                    <p
                                      class="btn-delete-varient text-danger"
                                      @click="deleteType(varientIndex)"
                                    >Delete Type</p>
                                  </b-col>

                                  <div class="col-6">
                                    <div
                                      class="row"
                                      v-for="(value, valueIndex) in varientSection.values.$each.$iter"
                                      :key="valueIndex"
                                    >
                                      <div class="col-10">
                                        <b-form-group
                                          class="hi"
                                          label="Value"
                                          label-for="varientValue"
                                        >
                                          <b-form-input
                                            id="varientValue"
                                            v-model="value.individualValue.$model"
                                            :state="value.individualValue.$dirty ? !value.individualValue.$error : null"
                                          ></b-form-input>

                                          <b-form-invalid-feedback>
                                            <p
                                              v-if="!value.individualValue.required"
                                            >Value is required</p>
                                          </b-form-invalid-feedback>
                                        </b-form-group>
                                      </div>

                                      <!-- <div class="col-2 col-sm-2">
                                        <b-button
                                          v-if="varientSection.values.length !== 1"
                                          size="sm"
                                          class="btn-delete-value"
                                          variant="danger"
                                          @click="removeValue(varientIndex, valueIndex)"
                                        >-</b-button>
                                      </div>-->
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
                      <!-- <pre>{{$v}}</pre> -->
                    </div>
                    <!-- <VarientOption
                      v-model="varientSections"
                      :v="$v.varientSections.$each"
                      @addVarient="addVarient"
                      @addValue="addValue"
                      @removeValue="removeValue"
                      @deleteType="deleteType"
                    ></VarientOption>-->
                  </form>
                </b-modal>

                <b-container class="px-0" fluid>
                  <div class="table-wrapper">
                    <div class="table-title">
                      <b-row class="mx-auto">
                        <b-col col-sm="3" class="text-left">
                          <h5>Variants</h5>
                        </b-col>
                      </b-row>
                    </div>

                    <!-- Varient Table -->
                    <b-table responsive striped :items="varientDetails" :fields="varientFields">
                      <!-- research what is template and slot-scope -->
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
                    <!-- @shown="displayDropZone" -->
                    <b-modal
                      id="editVarient"
                      ref="editVarientModal"
                      title="Edit Varient"
                      @ok="editVarientTableDialog"
                      @cancel="cancelEditVarientTableDialog"
                      @close="cancelEditVarientTableDialog"
                    >
                      <form @submit.stop.prevent="submitDiscount">
                        <b-form-group label="SKU Number">
                          <b-form-input id="productSKU" v-model="form.varient.SKUNumber"></b-form-input>
                        </b-form-group>

                        <b-form-group label="Option Type">
                          <b-form-input id="optionType" v-model="form.varient.type" disabled></b-form-input>
                        </b-form-group>

                        <b-form-group label="Option Value">
                          <b-form-input id="optionValue" v-model="form.varient.value" disabled></b-form-input>
                        </b-form-group>

                        <b-form-group label="Current Qty">
                          <b-form-input id="currentQuantity" v-model="form.varient.currentQuantity"></b-form-input>
                        </b-form-group>

                        <b-form-group label="Min. Qty">
                          <b-form-input id="minimumQuantity" v-model="form.varient.minimumQuantity"></b-form-input>
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
                </b-container>
              </b-form>

              <!-- <notifications/> -->
              <div class="text-right">
                <b-button
                  @click="submit"
                  variant="primary"
                  class="mr-3 px-4"
                  :disabled="submitLoader"
                >
                  <b-spinner small class="mr-2" v-if="submitLoader"></b-spinner>
                  <span>Save</span>
                </b-button>
                <b-button class="px-4" to="/ResourceManagement">Cancel</b-button>
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
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";
import VarientOption from "@/components/VarientOption";
import clonedeep from "lodash.clonedeep"; // Install lodash.clonedeep as asingle module
import differencewith from "lodash.differencewith";
import isequal from "lodash.isequal";
import moment from "moment";
import DiscountForm from "@/components/DiscountForm";
import {
  UPLOAD_PRODUCT_IMAGES,
  DELETE_PRODUCT_IMAGES,
  UPLOAD_AND_DELETE_PRODUCT_IMAGES,
  CREATE_PRODUCT
} from "@/store/actions/product";
import { required, minLength } from "vuelidate/lib/validators";

// function myCustomValidator () {
//   return value === 'isOk' // should return Boolean
// }

export default {
  components: {
    SideBar,
    DashboardHeader,
    vueDropzone,
    Multiselect,
    Datepicker,
    VarientOption,
    DiscountForm
  },

  data() {
    return {
      form: {
        name: "",
        price: null, // null or string?
        imageHeight: null,
        imageWidth: null,
        effectiveStartDate: "",
        effectiveEndDate: "",
        description: "",
        discount: {
          effectiveStartDate: "",
          effectiveEndDate: "",
          discountValue: null,
          discountType: "",
          isPercentage: false
        },
        varient: {
          SKUNumber: null,
          varientName: "",
          currentQuantity: null,
          minimumQuantity: null,
          type: "",
          value: "",
          files: [],
          productImages: []
        }
      },

      varientErrorIndex: null,

      discountFields: [
        { key: "discountValue", label: "Discount" },
        { key: "effectiveStartDate", label: "Start Date" },
        { key: "effectiveEndDate", label: "End Date" },
        { key: "discountType", label: "Discount Type" },
        { key: "actions", label: "Actions" }
      ],

      discountDetails: [],

      datePicker: {
        style: true,
        format: "yyyy-MM-dd"
      },

      varientId: 0,
      varientSectionId: 0,

      // This is from varient Option
      varientSections: [
        {
          varientSectionId: 0,
          type: "",
          values: [
            {
              varientId: 0,
              individualValue: ""
            }
          ]
        }
      ],

      hasUserEditVarient: false,
      originalVarient: [],

      varientDetails: [],
      discountIndex: null,
      selectedVarientIndex: null,
      deletedImageKeys: [],

      varientFields: [
        { key: "SKUNumber", label: "SKU" },
        { key: "type", label: "Type" },
        { key: "value", label: "Value" },
        { key: "currentQuantity", label: "Current Qty" },
        { key: "minimumQuantity", label: "Min Qty" },
        { key: "imageCount", label: "Image" },
        { key: "actions", label: "Actions" }
      ],

      /* This is similar to configuration options in dropzone.js */
      dropOptions: {
        url: "https://httpbin.org/post",
        acceptedFiles: "image/*",
        // maxFiles: 1,
        addRemoveLinks: true,
        autoProcessQueue: false,
        thumbnailWidth: 160,
        thumbnailHeight: 160
      },
      isFileDuplicate: false,
      submitLoader: false,
      varientSubmitLoader: false
    };
  },

  validations: {
    varientSections: {
      $each: {
        type: {
          required
          // isDuplicate(type, varient) {
          //   console.log(varient);
          //   const varientIndex = this.varientSections.findIndex(
          //     v =>
          //       v.type === type &&
          //       v.varientSectionId === varient.varientSectionId
          //   );

          //   var isWrong = true;
          //   this.varientSections.forEach((varObject, index) => {
          //     if (index !== varientIndex) {
          //       if (
          //         varObject.type === varient.type &&
          //         varObject.varientSectionId !== varient.varientSectionId
          //       ) {
          //         isWrong = false;
          //       }
          //     }
          //   });

          //   console.log(varientIndex);
          //   console.log(this.varientSections.some(v => v.type === type));
          //   console.log(
          //     varientIndex || this.varientSections.some(v => v.type === type)
          //   );
          //   console.log(varientIndex || type === "hihi");

          //   if (varientIndex || type === "hihi") {
          //     return true;
          //   } else {
          //     return false;
          //   }

          //   // return varientIndex || type === "hihi";
          // }
        },
        values: {
          $each: {
            individualValue: {
              required
            }
          }
        },
        $trackBy: "varientSectionId"
      }
    }
  },

  methods: {
    handleAddDiscount() {
      let discount = this.form.discount;
      console.log(discount);
      this.formatDiscountDate(discount);
      if (discount.discountType === "Percentage") {
        discount.isPercentage = true;
      } else {
        discount.isPercentage = false;
      }
      console.log(discount);
      this.discountDetails.push(discount);
      this.form.discount = clonedeep({});
    },

    cancelDiscountDialog() {
      // Reset the discount object when user exits the add discount dialog
      this.form.discount = clonedeep({});
    },

    // This method is invoked when the edit button is clicked on the discount table
    editDiscountInfo(discount, index) {
      this.form.discount = discount;
      this.discountIndex = index;
    },

    handleEditDiscount() {
      let discount = this.form.discount;
      this.formatDiscountDate(discount);
      if (discount.discountType === "Percentage") {
        discount.isPercentage = true;
      } else {
        discount.isPercentage = false;
      }

      this.discountDetails[this.discountIndex] = this.form.discount;

      console.log(this.currentDiscountRowSelected);
      console.log(this.form.discount);
      console.log(this.discountDetails);

      // Once updated, remove the values in the field
      this.form.discount = clonedeep({});
    },

    deleteDiscountInfo(index) {
      this.discountIndex = index;
    },

    handleDeleteDiscount() {
      this.discountDetails.splice(this.discountIndex, 1);
    },

    formatDiscountDate(discount) {
      discount.effectiveStartDate = moment(
        this.form.discount.effectiveStartDate
      ).format("YYYY-MM-DD");
      discount.effectiveEndDate = moment(
        this.form.discount.effectiveEndDate
      ).format("YYYY-MM-DD");
    },

    // https://jsfiddle.net/Wuzix/qs6t9L7x/
    // https://zaengle.com/blog/using-v-model-on-nested-vue-components
    // https://stackoverflow.com/questions/47311936/v-model-and-child-components/47312172
    //https://stackoverflow.com/questions/40410332/vuejs-access-child-components-data-from-parent
    // https://stackoverflow.com/questions/40915436/vuejs-update-parent-data-from-child-component
    addVarient() {
      console.log(this.$v);
      let varientId = ++this.varientId;
      let varientSectionId = ++this.varientSectionId;

      this.varientSections.push({
        varientSectionId,
        type: "",
        values: [
          {
            varientId,
            individualValue: ""
          }
        ]
      });
      console.log(this.varientSections);
    },

    addValue(varientIndex) {
      console.log(this.$v);
      let varientId = ++this.varientId;
      this.varientSections[varientIndex].values.push({
        varientId,
        individualValue: ""
      });
      console.log(this.varientSections);
    },

    removeValue(varientIndex, valueIndex) {
      console.log(this.$v);
      this.varientSections[varientIndex].values.splice(valueIndex, 1);
    },

    deleteType(index) {
      console.log(this.$v);
      this.varientSections.splice(index, 1);
    },

    handleVarientSubmit(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    handleSubmit() {
      if (this.hasUserEditVarient) {
        let updatedVarientDetails = [];
        this.varientSections.forEach(varientSection => {
          let type = varientSection.type;
          varientSection.values.forEach(value => {
            let obj = {
              varientId: value.varientId,
              type,
              value: value.individualValue
            };
            updatedVarientDetails.push(obj);
          });
        });

        var subset = function(arr) {
          return arr.map(obj => {
            return {
              type: obj.type,
              value: obj.value,
              varientId: obj.varientId
            };
          });
        };

        // Subset the type, value and varientId property from both arrays so that they
        // can be used for comparison
        var varientDetailTypeAndValue = subset(this.varientDetails);
        var updatedVarientDetailTypeAndValue = subset(updatedVarientDetails);

        console.log(varientDetailTypeAndValue);
        console.log(updatedVarientDetailTypeAndValue);

        // #1 Inspect and compare varientDetail (old) with updatedVarientDetail (new)
        var difference1 = differencewith(
          varientDetailTypeAndValue,
          updatedVarientDetailTypeAndValue,
          isequal
        );

        // #2 Compare updatedVarientDetail (new) with varientDetail (old)
        var difference2 = differencewith(
          updatedVarientDetailTypeAndValue,
          varientDetailTypeAndValue,
          isequal
        );

        console.log(difference1);
        console.log(difference2);

        // Check to see if user have updated the current varient type or value
        // by comparing the varientId present in both arrays (difference 1 and 2)
        let sameTypeAndValues = difference2.filter(o1 =>
          difference1.some(o2 => o1.varientId === o2.varientId)
        );

        console.log(sameTypeAndValues);
        console.log(this.varientDetails);

        if (sameTypeAndValues.length > 0) {
          sameTypeAndValues.forEach((updateObject, index) => {
            // If user make an update, find out which fields were updated
            // by checking with the varient Id
            const foundIndex = this.varientDetails.findIndex(
              el => el.varientId === updateObject.varientId
            );

            if (foundIndex > -1) {
              this.varientDetails[foundIndex].type = updateObject.type;
              this.varientDetails[foundIndex].value = updateObject.value;
              // Set a temporary property called "update" to prevent this particular object
              // from being sliced and pushed
              this.varientDetails[foundIndex].update = true;
            }
          });
        }

        console.log(this.varientDetails);

        // A difference means that users have deleted varient object(s)
        // Hence, we must remove it from varientDetails array
        if (difference1.length > 0) {
          difference1.forEach(differenceObj => {
            // Check to see if product exist
            var index = this.varientDetails.findIndex(
              obj =>
                obj.type === differenceObj.type &&
                obj.value === differenceObj.value &&
                obj.varientId === differenceObj.varientId &&
                // Do not retrieve the index where update is true,
                // this is to prevent the updated object from being sliced
                obj.update != true
            );

            // If it exist, slice it
            if (index != -1) {
              this.varientDetails.splice(index, 1);
            }
          });
        }

        // A difference means that user have added new varient object(s). Hence,
        // we must add it to varientDetails array
        if (difference2.length > 0) {
          console.log(this.varientDetails);
          console.log(difference2);
          difference2.forEach((differenceObj, index) => {
            console.log(differenceObj);
            var index = this.varientDetails.findIndex(
              obj =>
                obj.type === differenceObj.type &&
                obj.value === differenceObj.value &&
                obj.varientId === differenceObj.varientId
            );
            // If found, no need to push
            if (index > -1) {
            } else {
              this.varientDetails.push(differenceObj);
            }
          });
        }

        // Once everything is done, we will remove the temporary "update" property
        this.varientDetails.forEach(obj => {
          if (obj.update != undefined) {
            delete obj.update;
          }
        });
      } else {
        this.varientSections.forEach(varientSection => {
          let type = varientSection.type;
          varientSection.values.forEach(value => {
            let obj = {
              varientId: value.varientId,
              type,
              value: value.individualValue
            };
            this.varientDetails.push(obj);
          });
        });
        console.log(this.varientDetails);
      }

      this.hasUserEditVarient = true;

      //https://stackoverflow.com/questions/49943140/validating-form-inside-a-modal-with-vuelidate-and-bootstrap-vue
      this.$nextTick(() => {
        this.$refs.varientModal.hide();
      });
    },

    cancel() {
      console.log(this.varientDetails);
      // If user previously never save any varient options,
      // reset the values when the modal dialog is cancelled
      if (this.varientDetails.length === 0) {
        this.varientSections = [
          {
            type: "",
            values: [""]
          }
        ];
      } else {
        console.log("revert back to previous changes");
        console.log(this.varientSections);
        if (this.hasUserEditVarient) {
          this.varientSections = clonedeep(this.originalVarient);
        }
      }
    },

    openVarientModal() {
      console.log("hasuserEditvarient? " + this.hasUserEditVarient);
      console.log(this.varientSections);
      if (this.hasUserEditVarient) {
        // Use lodash to deep clone the array so that it does not contain reference to original array
        this.originalVarient = clonedeep(this.varientSections);
        console.log("open variant model ");
        console.log(this.originalVarient);
      }
    },

    // This method is invoked when the edit button is clicked on the varient table
    varientInfo(varient, index) {
      this.selectedVarientIndex = index;

      if (varient.SKUNumber == null) {
        this.form.varient.type = varient.type;
        this.form.varient.value = varient.value;
      } else {
        this.form.varient = clonedeep(varient);
        // this.form.varient = Object.assign(this.form.varient, varient);
        console.log(this.form.varient);

        setTimeout(() => {
          this.form.varient.files.forEach(file => {
            var index = this.form.varient.productImages.findIndex(
              image => image.imageKey === file.upload.uuid + ".jpg"
            );

            console.log(file);
            console.log(file.imageUrl);

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
      console.log(index);

      console.log(this.form.varient.files);
      console.log(this.varientDetails);
      console.log(this.varientDetails[index].files);
      this.varientSubmitLoader = true;

      // Throw this into a new method
      // Check if user have make any changes to the dropzone. For example
      // create or remove. If they did, make the changes in S3 as well
      const fileDifference = differencewith(
        this.form.varient.files,
        this.varientDetails[index].files
      );
      console.log(fileDifference);

      // If both api calls are running, I will call the this.updateVarient() once
      // both of the calls are done
      if (fileDifference.length > 0 && this.deletedImageKeys.length > 0) {
        const formData = new FormData();
        for (var i = 0; i < fileDifference.length; i++) {
          formData.append(
            "imageFiles[" + i + "].ImageFile.File",
            fileDifference[i]
          );
          formData.append(
            "imageFiles[" + i + "].ImageKey",
            fileDifference[i].upload.uuid + ".jpg"
          );
        }
        var guids = this.deletedImageKeys;
        let obj = {
          formData,
          guids
        };
        console.log(obj);
        this.$store
          .dispatch(UPLOAD_AND_DELETE_PRODUCT_IMAGES, obj)
          .then(response => {
            console.dir(response);
            console.dir(response[0]);

            console.log(this.form.varient);
            console.log(this.form.varient.productImages);

            response[0].productImages.forEach((productImage, index) => {
              this.form.varient.productImages.push({
                imageKey: productImage.imageKey,
                imageUrl: productImage.imageUrl,
                imageSize: fileDifference[index].size
              });
              console.log(this.form.varient);
              console.log(this.form.varient.productImages);
            });

            console.log(this.form.varient);
            console.log(this.form.varient.productImages);

            // Remove keys from the productImages array once s3 deleted the thumbnail
            // Return the array of all the objects that does not contain the deleted guid
            this.form.varient.productImages = this.form.varient.productImages.filter(
              image => !guids.includes(image.imageKey)
            );

            console.log(this.form.varient);
            this.updateVarientTable(this.form.varient);
          })
          .catch(error => {
            console.dir(error);
            alert("error");
            this.varientSubmitLoader = false;
          });
      } else {
        // If have, we need to find out what to add or remove from the s3 bucket
        // if got filedifference, mean user add an image
        if (fileDifference.length > 0) {
          // Call this method add to bucket
          // and another method to be delete from bucket
          const formData = new FormData();
          for (var i = 0; i < fileDifference.length; i++) {
            formData.append(
              "imageFiles[" + i + "].ImageFile.File",
              fileDifference[i]
            );
            formData.append(
              "imageFiles[" + i + "].ImageKey",
              fileDifference[i].upload.uuid + ".jpg"
            );
          }

          for (var pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
          }

          this.$store
            .dispatch(UPLOAD_PRODUCT_IMAGES, formData)
            .then(response => {
              console.dir(response);

              response.productImages.forEach((productImage, index) => {
                console.log("called");
                this.form.varient.productImages.push({
                  imageKey: productImage.imageKey,
                  imageUrl: productImage.imageUrl,
                  imageSize: fileDifference[index].size
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
        } else if (this.deletedImageKeys.length > 0) {
          console.log(this.deletedImageKeys);

          this.$store
            .dispatch(DELETE_PRODUCT_IMAGES, this.deletedImageKeys)
            .then(response => {
              console.dir(response);
              console.log(this.form.varient);

              // Remove keys from the productImages array once s3 deleted the thumbnail
              // Return the array of all the objects that does not contain the deleted guid
              this.form.varient.productImages = this.form.varient.productImages.filter(
                image => !this.deletedImageKeys.includes(image.imageKey)
              );

              // this.deletedImageKeys = Object.assign([], this.deletedImageKeys);
              console.log(this.form.varient);
              console.log("delete done called");

              this.updateVarientTable(this.form.varient);
            })
            .catch(error => {
              console.dir(error);
              alert("error");
            });
        } else {
          this.updateVarientTable(this.form.varient);
        }
      }
    },

    updateVarientTable(varient) {
      console.log("caled");
      console.log(varient);
      varient.imageCount = varient.productImages.length;
      console.log(varient);
      console.log(this.varientDetails);
      console.log(this.selectedVarientIndex);
      let index = this.selectedVarientIndex;

      // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
      // A property must be declared in the data() object for vuejs to detect any changes and be reactive
      // Since this.varientDetails[index] is an object inside the array, vuejs will not detect changes
      // and update the dom. Hence, create a fresh object with properties from both the original object
      // to trigger change
      // Loop through the array to find out which varient object the user edited.
      // Once found, update the details based on the varient
      // https://stackoverflow.com/questions/51975190/splicing-array-does-not-re-render-table-row-vuejs
      // https://www.telerik.com/blogs/so-what-actually-is-vue-set
      // https://stackoverflow.com/questions/52132321/array-of-objects-correct-way-of-updating-an-object-within-the-vue-js-ecosystem
      // this.$set(this.varientDetails, index, varient);

      // Loop through the array to find out which varient object the user edited.
      // Once found, update the details based on the varient
      this.varientDetails = this.varientDetails.map(el => {
        if (el.type === varient.type && el.value === varient.value) {
          return Object.assign(el, varient);
        }
        return el;
      });

      // Once updated, remove the values in the field
      // We need to create a new copy. If we do know, it will still
      // reference the old object
      this.form.varient = clonedeep({
        SKUNumber: null,
        varientName: "",
        currentQuantity: null,
        minimumQuantity: null,
        type: "",
        value: "",
        files: [],
        productImages: []
      });

      this.deletedImageKeys = clonedeep([]);

      console.log(this.varientDetails[index]);
      console.log(this.form.varient);
      console.log(this.varientDetails);
      console.log(this.deletedImageKeys);
      this.varientSubmitLoader = false;

      this.$nextTick(() => {
        this.$refs.editVarientModal.hide();
      });
    },

    // This method will be invoked when the cancel or x button is clicked on the varient modal dialog
    cancelEditVarientTableDialog() {
      // Remove the values in the field (if any) when the user exits the dialog
      this.form.varient = clonedeep({
        SKUNumber: null,
        varientName: "",
        currentQuantity: null,
        minimumQuantity: null,
        type: "",
        value: "",
        files: [],
        productImages: []
      });
      this.$refs.myVueDropzone.removeAllFiles();
    },

    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
    },

    duplicateFileCheck(file) {
      // alert("duplicate");
      this.isFileDuplicate = true;
    },

    addFileToDropzone(file) {
      // alert("add called");
      console.log(file);

      if (file.manuallyAdded !== true && this.isFileDuplicate !== true) {
        // this.form.varient.files = Object.assign([], this.form.varient.files);
        // Add the user upload file into the array
        console.log("Added file into files array ");
        this.form.varient.files.push(file);
        console.dir(this.form.varient.files);
        console.dir(this.form.varient);
        console.log(this.varientDetails[this.selectedVarientIndex]);
      }
      console.log(this.form.varient);
      console.log(this.form.varient.files);
      this.isFileDuplicate = false;
    },

    deleteFileFromDropzone(file) {
      console.log(file);
      if (file.manuallyAdded !== true) {
        // Remove the deleted file from the array
        this.form.varient.files = this.form.varient.files.filter(
          el => el.upload.uuid != file.upload.uuid
        );
      } else {
        console.log(this.form.varient);
        console.log(this.form.varient.files);

        // I can't test with manually add file or type, cos all the item in the array
        // have both the same values
        // If you want to remove manually added file, you can't compare it against uuid
        // since it does not contain it
        this.form.varient.files = this.form.varient.files.filter(
          el => el.name !== file.name && el.size !== file.size
        );

        console.log(this.form.varient);
        console.log(this.form.varient.files);
        console.log(this.varientDetails[this.selectedVarientIndex]);

        // Find out which image was deleted by comparing the uuid from productImages and form.varient.file
        this.form.varient.productImages.forEach(image => {
          let parts = image.imageKey.split(".");
          let uuid = parts[0];
          console.log(uuid);
          const index = this.form.varient.files.findIndex(
            file => file.upload.uuid === uuid
          );
          console.log(index);
          if (index === -1) {
            this.deletedImageKeys.push(uuid + ".jpg");
          }
        });

        console.log(this.form.varient.productImages);
        console.log(this.varientDetails[this.selectedVarientIndex]);
      }
    },

    // handleMaxFileExceeded(file) {
    //   let dropzone = this.$refs.myVueDropzone.dropzone;
    //   dropzone.removeFile(file);
    // },

    message(method, messageText) {
      let config = {
        text: messageText,
        button: "ok"
      };
      this.$snack[method](config);
      // this.$snack[method](config)
    },

    submit() {
      const { varientDetails, discountDetails, form } = this;

      form.effectiveStartDate = moment(form.effectiveStartDate).format(
        "YYYY-MM-DD"
      );
      form.effectiveEndDate = moment(form.effectiveEndDate).format(
        "YYYY-MM-DD"
      );

      console.log(this.form);
      console.log(this.varientDetails);
      console.log(this.discountDetails);

      // this.uploadUserImage();

      // change to edit varient
      // successful notification

      // this.uploadUserImage();
      // when user submit, type is true or false
      // this.message("success", "You have successfully added a new product!");
      // this.$router.push("/ResourceManagement");

      this.submitLoader = true;

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
          this.$router.push("/ResourceManagement");
        })
        .catch(error => {
          console.dir(error);
          alert("error");
          this.submitLoader = false;
        });
    },

    getOptions() {
      return this.varientDetails.map((varient, index) => {
        return {
          skuNumber: varient.SKUNumber,
          optionType: varient.type,
          optionValue: varient.value,
          currentQuantity: varient.currentQuantity,
          minimumQuantity: varient.minimumQuantity,
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

/* .dz-max-files-reached {
  pointer-events: none;
  cursor: default;
} */

.table {
  margin-bottom: 0 !important;
}

#add-discount {
  margin-right: 63px;
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
</style>
