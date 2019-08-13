<template>
  <section class="ftco-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 mb-5">
          <agile
            v-if="isSlideLoaded"
            class="main"
            ref="main"
            :options="mainOptions"
            :as-nav-for="asNavForMain"
          >
            <div
              class="slide"
              v-for="(slide, index) in slides"
              :key="index"
              :class="`slide--${index}`"
            >
              <ExpandableImage :src="slide"></ExpandableImage>
            </div>
          </agile>

          <agile
            v-if="isSlideLoaded && !onlyOneImage"
            class="thumbnails"
            id="single-thumbnail"
            ref="thumbnails"
            :options="thumbnailOptions"
            :as-nav-for="asNavForThumbnail"
          >
            <div
              class="slide slide--thumbnail"
              v-for="(slide, index) in slides"
              :key="index"
              :class="`slide--${index}`"
              @click="$refs.thumbnails.goTo(index)"
            >
              <img :src="slide" />
            </div>

            <template slot="prevButton">
              <i class="fas fa-chevron-left"></i>
            </template>
            <template slot="nextButton">
              <i class="fas fa-chevron-right"></i>
            </template>
          </agile>
        </div>

        <div class="col-lg-6 product-details pl-md-5 ftco-animate">
          <h3>{{productDetail.name}}</h3>
          <div class="text">
            <p v-if="productDetail.discounts.length != 0" class="price">
              <span class="mr-2 price-dc">${{productDetail.price.toFixed(2)}}</span>
              <span class="price-sale">${{discountPrice.toFixed(2)}}</span>
            </p>
            <p v-else class="price">
              <span>${{productDetail.price.toFixed(2)}}</span>
            </p>
          </div>

          <p class="product-description">{{productDetail.description}}</p>

          <div class="row">
            <div class="col-md-7 mb-3" v-if="productDetail.options.length > 0">
              <div
                class="input-group w-100"
                v-for="(attributeGroup, attributeGroupIndex) in productDetail.productAttributes"
                :key="attributeGroupIndex"
              >
                <div class="form-group w-100">
                  <div class="w-100">
                    <label>{{attributeGroup.attributeType}}:</label>
                  </div>

                  <div class="w-100">
                    <div
                      class="select-wrap w-100"
                      :class="{ iserror: $v.form.selectedAttribute.$each[attributeGroupIndex].$error}"
                    >
                      <div class="icon">
                        <span class="ion-ios-arrow-down"></span>
                      </div>

                      <select
                        id="form-attribute"
                        class="form-control"
                        v-model="form.selectedAttribute[attributeGroupIndex]"
                        :disabled="!enabled(form.selectedAttribute, attributeGroupIndex)"
                        @change="selectedAttribute(attributeGroupIndex)"
                      >
                        <option value>Select Option</option>
                        <option
                          v-for="(attributeValue, index) in attributeGroup.attributeValue"
                          :key="index"
                          :disabled="productDetail.productAttributes.length === attributeGroupIndex + 1 && isDisabled(form.selectedAttribute, attributeGroupIndex, attributeValue)"
                        >
                          {{attributeValue}}
                          <p
                            v-if="productDetail.productAttributes.length === attributeGroupIndex + 1 && isDisabled(form.selectedAttribute, attributeGroupIndex, attributeValue)"
                          >- Not available</p>
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="lowStock.indicator" class="mb-3">
                <i class="far fa-clock fa-lg" id="low-stock-error-icon"></i>
                <span class="low-stock-message">Low in stock. Only {{lowStock.quantity}} left</span>
              </div>

              <div class="error-message-box" v-if="$v.form.selectedAttribute.$error">
                <i class="fas fa-exclamation-circle fa-lg" id="option-error-icon"></i>
                <span class="ml-2">Please select an option</span>
              </div>
            </div>

            <div class="w-100"></div>
            <div class="input-group col-md-7 d-flex mb-4">
              <b-input-group>
                <b-input-group-prepend>
                  <b-btn :disabled="disableMinus" variant="primary" @click="minus()">
                    <i class="ion-ios-remove"></i>
                  </b-btn>
                </b-input-group-prepend>

                <b-form-input type="number" :value="form.quantity" disabled></b-form-input>
                <b-input-group-prepend>
                  <b-btn variant="primary" @click="plus()" :disabled="disablePlus">
                    <i class="ion-ios-add"></i>
                  </b-btn>
                </b-input-group-prepend>
              </b-input-group>
            </div>
          </div>
          <b-btn variant="primary" @click="submitForm" class="btn-personalise col-md-7">Personalise</b-btn>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ExpandableImage from "@/components/ExpandableImage";
import { GET_ONE_PRODUCT_ECOMMERCE } from "@/store/actions/product";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    ExpandableImage
  },
  data() {
    return {
      // Values retrieved from the database
      productDetail: {
        id: "",
        name: "",
        price: 0,
        discounts: [],
        description: "",
        options: [],
        imageHeight: "",
        imageWidth: "",
        productAttributes: []
      },

      // Values selected by the users
      form: {
        quantity: 1,
        selectedAttribute: [],
        selectedOption: []
      },

      lowStock: {
        indicator: false,
        quantity: 0
      },

      disabled: false,

      asNavForMain: [],
      asNavForThumbnail: [],

      isSlideLoaded: false,
      onlyOneImage: false,

      mainOptions: {
        dots: false,
        fade: true,
        navButtons: false
      },

      thumbnailOptions: {
        autoplay: false,
        centerMode: true,
        dots: false,
        navButtons: false,
        slidesToShow: 1,
        responsive: [
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1
            }
          },
          {
            breakpoint: 1000,
            settings: {
              navButtons: true
            }
          }
        ]
      },

      slides: []
    };
  },

  validations: {
    form: {
      selectedAttribute: {
        $each: {
          required
        }
      }
    }
  },

  mounted() {
    this.getProductDetail();
  },

  methods: {
    getProductDetail() {
      let productId = localStorage.getItem("viewResourceId");
      this.$store
        .dispatch(GET_ONE_PRODUCT_ECOMMERCE, productId)
        .then(response => {
          this.productDetail.id = response.productId;
          this.productDetail.name = response.productName;
          this.productDetail.price = response.price;
          this.productDetail.discounts = response.discounts;
          this.productDetail.description = response.description;
          this.productDetail.imageHeight = response.imageHeight;
          this.productDetail.imageWidth = response.imageWidth;
          this.productDetail.options = response.options;

          this.productDetail.productAttributes = this.productAttributes();
          let attributeLength = this.productDetail.productAttributes.length;

          // Dynamically load the images to carousel slides
          response.options.forEach(option => {
            option.productImages.forEach(image => {
              this.slides.push(image.imageUrl);
            });
          });

          // If there is none/one image, we will not set up the thumbnail carousel
          if (this.slides.length <= 1) {
            this.onlyOneImage = true;
          } else {
            this.thumbnailOptions.responsive[0].settings.slidesToShow = this.slides.length;
            // Change carousel settings when viewed in mobile depending on the number of images received
            if (this.slides.length > 3) {
              this.thumbnailOptions.slidesToShow = 3;
            } else {
              this.thumbnailOptions.slidesToShow = this.slides.length;
            }
          }

          // Once done, set the boolean to true which will render the carousel
          this.isSlideLoaded = true;

          this.$nextTick(() => {
            this.asNavForMain.push(this.$refs.thumbnails);
            this.asNavForThumbnail.push(this.$refs.main);
          });

          // Initialize the selectedAttribute with an empty string
          // based on the size of the attributeLength
          for (let i = 0; i < attributeLength; i++) {
            this.form.selectedAttribute.push("");
          }
        })
        .catch(error => {
          alert("error");
        });
    },

    productAttributes() {
      // The accumulator have a default value of {}
      let productAttributes = this.productDetail.options.reduce(
        (accumulator, { attributes }) => {
          attributes.forEach(({ attributeType, attributeValue }) => {
            // For each attribute, check if the accumulator object have the correct
            // "type" as key If it does not, create an object with the following structure
            // {type: {type, value}}". Besides that, we will use Set() to keep only unique values
            accumulator[attributeType] = accumulator[attributeType] || {
              attributeType,
              attributeValue: new Set()
            };
            accumulator[attributeType].attributeValue.add(attributeValue);
          });
          return accumulator;
        },
        {}
      );

      // Use Object.values() to get the attributeType and attributeValue
      // and map it to our desired format: {attributeType, attributeValue[]}
      return Object.values(productAttributes).map(
        ({ attributeType, attributeValue }) => ({
          attributeType,
          attributeValue: [...attributeValue]
        })
      );
    },

    isDisabled(selectedAttributes, index, selectValue) {
      let attributeSize = this.productDetail.productAttributes.length;

      // Check if user selected an option for all the dropdown(s) except for the last dropdown
      let isSelected = false;
      for (let i = 0; i < selectedAttributes.length - 1; i++) {
        if (selectedAttributes[i] === "") {
          isSelected = false;
          break;
        } else {
          isSelected = true;
        }
      }

      // Continue to run this method if the index received is the last dropdown and
      // user selected an option for all the dropdown(s) except for the last dropdown
      if (attributeSize !== index + 1 || !isSelected) {
        return false;
      } else {
        // Slice out the last index that contains an empty string since the user
        // have not yet selected any value from the last dropdown list. After that,
        // push each option from the last dropdown into the array. This will form
        // the combination in which we can use to find the option object
        let combination = selectedAttributes.slice(0, -1);
        combination.push(selectValue);

        // Find the option object based on the combination
        let optionDetails = this.productDetail.options.find(option => {
          return option.attributes.every(attri =>
            combination.includes(attri.attributeValue)
          );
        });

        // If quantity is 0, return true to disable the option
        if (optionDetails.currentQuantity === 0) {
          return true;
        }
        return false;
      }
    },

    enabled(array, index) {
      // If the incoming index is 0, this will indicate that it is the first dropdown.
      // Hence, it will never enter the loop and therefore will be true/enabled at all times
      for (let a = 0; a < index; a++) {
        // check if the previous dropdown is empty. If it is empty, disable the current dropdown
        if (array[a] === "") {
          return false;
        }
      }
      return true;
    },

    selectedAttribute(index) {
      const { selectedAttribute } = this.form;
      const { options, productAttributes } = this.productDetail;
      let isSelected = false;

      // Check if index is not the last dropdown
      if (index !== productAttributes.length - 1) {
        // Check if user selected an option for all the dropdown(s) except for the last dropdown
        for (let i = 0; i < selectedAttribute.length - 1; i++) {
          if (selectedAttribute[i] !== "") {
            isSelected = true;
            break;
          } else {
            isSelected = false;
          }
        }
        // If have, reset the last dropdown value
        if (isSelected) {
          selectedAttribute[selectedAttribute.length - 1] = "";
        }
      }

      // Remove any lowStock values
      this.lowStock.indicator = false;
      this.lowStock.quantity = 0;

      // Check to see if array contains empty values
      let isEmpty = selectedAttribute.some(el => el === "");

      if (!isEmpty) {
        // Find the option object based on the selected attribute from the dropdown
        let optionDetails = options.find(option => {
          return option.attributes.every(attri =>
            selectedAttribute.includes(attri.attributeValue)
          );
        });
        this.form.selectedOption = optionDetails;
        if (optionDetails) {
          this.checkForLowStock(optionDetails);
        }
      }
    },

    checkForLowStock(optionDetails) {
      if (optionDetails.currentQuantity <= 10) {
        this.lowStock.indicator = true;
        this.lowStock.quantity = optionDetails.currentQuantity;
      } else {
        this.lowStock.indicator = false;
      }
      // Set quantity back to 1 upon new select
      this.form.quantity = 1;
    },

    minus() {
      this.form.quantity--;
    },

    plus() {
      this.form.quantity++;
    },

    submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
    }
  },

  computed: {
    discountPrice() {
      const {
        isPercentage,
        discountPrice,
        discountValue
      } = this.productDetail.discounts[0];

      return isPercentage ? discountPrice : discountValue;
    },

    disableMinus() {
      return this.form.quantity <= 1 ? true : false;
    },

    disablePlus() {
      // Disable the plus button if user choose a quantity that is more than the low stock quantity
      // or the maximum number of quantity that can buy per item (5)
      return (this.lowStock.indicator === true &&
        this.form.quantity >= this.lowStock.quantity) ||
        this.form.quantity === 5
        ? true
        : false;
    }
  }
};
</script>

<style scoped>
h3,
p,
label,
span {
  line-height: 1.8;
  color: #333333;
}
.ftco-section {
  padding: 9em 0;
  position: relative;
}
</style>

<style lang="scss">
// Product carousel
.main {
  margin-bottom: 30px;
}
.thumbnails {
  margin: 0 -5px;
  width: calc(80% + 10px);
}
.agile__nav-button {
  background: transparent;
  border: none;
  color: #400040;
  cursor: pointer;
  font-size: 24px;
  transition-duration: 0.3s;
}
.thumbnails .agile__nav-button {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.thumbnails .agile__nav-button--prev {
  left: -45px;
  color: #ff4848 !important;
}
.thumbnails .agile__nav-button--next {
  right: -45px;
  color: #ff4848 !important;
}
.agile__nav-button:hover {
  color: #888;
}
.agile__dot {
  margin: 0 10px;
}
.agile__dot button {
  background-color: #eee;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: block;
  height: 10px;
  font-size: 0;
  line-height: 0;
  margin: 0;
  padding: 0;
  transition-duration: 0.3s;
  width: 10px;
}
.text_dot--current button,
.text_dot:hover button {
  background-color: #888;
}
.slide {
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  height: 450px;
  justify-content: center;
}
.slide--thumbnail {
  cursor: pointer;
  height: 100px;
  padding: 0 5px;
  transition: opacity 0.3s;
}
.slide--thumbnail:hover {
  opacity: 0.75;
}
.slide img {
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  -o-object-position: center;
  object-position: center;
  width: 100%;
}
.agile--fade .agile__slide {
  height: 100% !important;
}

// Product-details
.product-details {
  h3 {
    text-transform: uppercase;
    font-size: 28px;
    font-weight: 300;
  }
  .price {
    span {
      font-size: 30px;
      color: #000000;
    }
  }
  button {
    i {
      color: #000000;
    }
  }
  .quantity-left-minus {
    background: transparent;
    padding: 16px 20px;
  }
  .quantity-right-plus {
    background: transparent;
    padding: 16px 20px;
  }
  button,
  .form-control {
    height: 54px !important;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    color: #000000;
    padding: 10px 20px;
    background: transparent !important;
    font-size: 14px;
  }
  .form-group {
    position: relative;
    .form-control {
      padding-right: 40px;
      color: #000000;
      background: transparent !important;
      &::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: lighten(#000000, 30%);
      }
      &::-moz-placeholder {
        /* Firefox 19+ */
        color: lighten(#000000, 30%);
      }
      &:-ms-input-placeholder {
        /* IE 10+ */
        color: lighten(#000000, 30%);
      }
      &:-moz-placeholder {
        /* Firefox 18- */
        color: lighten(#000000, 30%);
      }
    }
    .icon {
      position: absolute;
      top: 50%;
      right: 20px;
      font-size: 14px;
      transform: translateY(-50%);
      color: #000000;
      span {
        color: #000000;
      }
    }
    .select-wrap {
      position: relative;
      select {
        font-size: 13px;
        appearance: none;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
    }
  }
}
.text p.price span.price-dc {
  text-decoration: line-through;
  color: #b3b3b3;
}
.text p.price span.price-sale {
  color: #e5594b;
  font-weight: 900;
  letter-spacing: 2px;
}
#single-thumbnail {
  margin: 0 auto;
}
.form-group .select-wrap select {
  text-transform: none !important;
}
.error-message-box {
  background-color: #fae7ec;
  padding: 10px;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  margin-bottom: 20px;
}
.low-stock-message {
  margin-left: 0.5rem;
  font-size: 17px;
  font-weight: 600;
  text-transform: uppercase;
  color: #e5594b;
}
#low-stock-error-icon {
  color: #e5594b;
}
#option-error-icon {
  width: 4% !important;
}
button:disabled {
  background-color: #f5f5f6 !important;
}
button:disabled:hover {
  cursor: not-allowed;
  color: grey;
}
.iserror {
  border: 1px solid red !important;
}
.product-details .btn-personalise {
  background: #e5594b !important;
  border: 1px solid #e5594b !important;
  color: #fff !important;
  border-radius: 30px;
  padding-bottom: 16px;
  padding-left: 48px;
  padding-right: 48px;
  padding-top: 16px;
}
#option-error-icon {
  margin-right: 10px;
  color: #000000;
}
.product-description {
  white-space: pre-line;
}
</style>

