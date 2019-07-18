<template>
  <div id="wrapper">
    <SideBar></SideBar>
    <div id="content-wrapper">
      <div id="content">
        <DashboardHeader title="Resource Management - Update Resource"></DashboardHeader>

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
                    <!-- <VarientOption
                      v-model="varientSections"
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
                      @cancel="cancelEditVarientTableDialog"
                      @close="cancelEditVarientTableDialog"
                    >
                      <form @submit.stop.prevent="submitDiscount">
                        <b-form-group label="SKU Number">
                          <b-form-input id="productSKU" v-model="form.varient.SKUNumber"></b-form-input>
                        </b-form-group>

                        <b-form-group label="Varient">
                          <b-form-input
                            id="varientCombination"
                            v-model="form.varient.combination"
                            disabled
                          ></b-form-input>
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
                <b-button @click="submit" variant="primary" class="mr-3 px-4">Save</b-button>
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
import clonedeep from "lodash.clonedeep"; // Install lodash.clonedeep as asingle module
import differencewith from "lodash.differencewith";
import isequal from "lodash.isequal";
import moment from "moment";
import DiscountForm from "@/components/DiscountForm";
import { required, minLength } from "vuelidate/lib/validators";
import {
  UPLOAD_PRODUCT_IMAGES,
  DELETE_PRODUCT_IMAGES,
  UPLOAD_AND_DELETE_PRODUCT_IMAGES,
  GET_ONE_PRODUCT,
  UPDATE_ONE_PRODUCT
} from "@/store/actions/product";

export default {
  components: {
    SideBar,
    DashboardHeader,
    vueDropzone,
    Multiselect,
    Datepicker,
    DiscountForm
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
          discountValue: null,
          discountType: "",
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
      selectedVarientIndex: null,
      deletedImageKeys: [],

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
    varientSections: {
      $each: {
        type: {
          required,
          isDuplicateType(type, varient) {
            // Validations to check if there is duplicate values for the field "type"
            // The condition obj.values !== varient.values is to ensure that the
            // current field that the user is typing is not being validated.
            // But rather, other elements in the array
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
              required
            }
          }
        }
      }
    }
  },

  mounted() {
    this.$store
      .dispatch(GET_ONE_PRODUCT, 2019)
      .then(response => {
        console.dir(response);
        this.form.productId = response.productId;
        this.form.name = response.productName;
        this.form.price = response.price;
        this.form.imageHeight = response.imageHeight;
        this.form.imageWidth = response.imageWidth;
        this.form.effectiveStartDate = response.effectiveStartDate;
        this.form.effectiveEndDate = response.effectiveEndDate;
        this.form.description = response.description;

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
            console.log(value);
          });
        });

        // Should pass in this this.varient sections so that they can understand
        // Get the combination based on this.varientSections
        let varientResults = this.getCombinations();

        // Update this.varientDetails to have the same combination and combineId as
        // varientResults
        varientResults.forEach((varient, index) => {
          this.varientDetails[index].combination = varient.combination;
          this.varientDetails[index].combinedId = varient.combinedId;
        });

        console.log(varientResults);
        console.log(this.varientDetails);

        this.discountDetails = response.discountPrice.map(discount => {
          // Attach the property called productId
          discount.productId = this.form.productId;
          // Add a new property called discount type
          let discountTypeProp = {
            discountType: discount.isPercentage ? "Percentage" : "Fixed"
          };
          discount.effectiveStartDate = moment(
            discount.effectiveStartDate
          ).format("YYYY-MM-DD");
          discount.effectiveEndDate = moment(discount.effectiveEndDate).format(
            "YYYY-MM-DD"
          );
          // discount.optionId =

          // Assign new propertiy and return
          return Object.assign(discount, discountTypeProp);
        });

        console.log(response);
        console.log(this.varientSections);
        console.log(this.varientDetails);
        console.log(this.discountDetails);
      })
      .catch(error => {
        console.dir(error);
        alert("error");
      });
  },

  methods: {
    handleAddDiscount() {
      let discount = this.form.discount;
      this.formatDiscountDate(discount);
      if (discount.discountType === "Percentage") {
        discount.isPercentage = true;
      } else {
        discount.isPercentage = false;
      }
      this.discountDetails.push(discount);
      this.form.discount = {};
    },

    // Reset the discount object when user exits the discount dialog
    cancelDiscountDialog() {
      this.form.discount = clonedeep({});
    },

    // This method is invoked when the edit button is clicked on the "discount table"
    editDiscountInfo(discount, index) {
      // Get the index (row) and discount object selected
      this.form.discount = Object.assign({}, discount);
      this.discountIndex = index;
    },

    // This method is invoked when the OK button is clicked on the "modal dialog" (Save the changes)
    handleEditDiscount() {
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
      this.form.discount = clonedeep({});
    },

    deleteDiscountInfo(index) {
      this.discountIndex = index;
    },

    handleDeleteDiscount() {
      // Delete discount object based on the index
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

    addVarient() {
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
      console.log(this.varientSections);
    },

    addValue(varientIndex) {
      this.varientSections[varientIndex].values.push({
        id: Math.random()
          .toString(36)
          .substring(7),
        individualValue: ""
      });
      console.log(this.varientSections);
    },

    removeValue(varientIndex, valueIndex) {
      this.varientSections[varientIndex].values.splice(valueIndex, 1);
    },

    deleteType(index) {
      this.varientSections.splice(index, 1);
    },

    handleVarientSubmit(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    // This method is invoked when user clicked on the "OK" button on the varient option modal dialog
    handleSubmit() {
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

      this.varientDetails = varientResults;

      //https://stackoverflow.com/questions/49943140/validating-form-inside-a-modal-with-vuelidate-and-bootstrap-vue
      this.$nextTick(() => {
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
        this.varientSections = clonedeep(this.originalVarient);
      }
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

      let index = this.selectedVarientIndex;
      // this.varientSubmitLoader = true;

      // Check if there is any changes between the old and new list
      let newImages = differencewith(
        this.form.varient.files,
        this.varientDetails[index].files
      );

      // Keep the objects in the array that has the dataURL value as it signifies a new file.
      newImages = newImages.filter(fd => {
        return fd.dataURL !== undefined;
      });

      console.log(newImages);

      // Remember to remove it at import as well
      if (newImages.length > 0) {
        this.uploadImages();
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
      this.isFileDuplicate = true;
    },

    addFileToDropzone(file) {
      console.log(file);
      if (file.manuallyAdded !== true && this.isFileDuplicate !== true) {
        // Add the user upload file into the array
        console.log("Added file into files array ");
        file.isNew = true;
        this.form.varient.files.push(file);
        console.dir(this.form.varient.files);
      }
      console.log(this.form.varient);
      this.isFileDuplicate = false;
    },

    deleteFileFromDropzone(file) {
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

    submit() {
      const { varientDetails, discountDetails, form } = this;

      // put in method?
      form.effectiveStartDate = moment(form.effectiveStartDate).format(
        "YYYY-MM-DD"
      );
      form.effectiveEndDate = moment(form.effectiveEndDate).format(
        "YYYY-MM-DD"
      );

      console.log(this.form);
      console.log(this.varientDetails);
      console.log(this.discountDetails);

      this.submitLoader = true;

      var productObj = {
        productId: form.productId,
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
        .dispatch(UPDATE_ONE_PRODUCT, productObj)
        .then(response => {
          console.dir(response);
          this.submitLoader = false;
          // this.message("success", "You have successfully added a new product!");
          // this.$router.push("/ResourceManagement");
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
          productId: varient.productId,
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
