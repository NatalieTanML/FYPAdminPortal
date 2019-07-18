<template>
  <div></div>
  <!-- Dynamically Create the section. -->
  <!-- <div class="container">
    <div v-for="(varientSection, varientIndex) in value" :key="varientIndex">
      <b-row>
        <b-col>
          <form>
            <div class="offset-md-1">
              <div class="row">
                <b-col cols="5">
                  <b-form-group
                    label="Type"
                    label-for="varientType"
                    :class="{ hasError: v.$error }"
                  >
                    <b-form-input v-model="varientSection.type" id="varientType"></b-form-input>
                    <div class="text-sm mt-2 text-grey-darker">{{v}}</div>
                  
                  </b-form-group>
                  <p
                    class="btn-delete-varient text-danger"
                    @click="deleteType(varientIndex)"
                  >Delete Type</p>
                </b-col>

                <div class="col-6">
                  <div
                    class="row"
                    v-for="(value, valueIndex) in varientSection.values"
                    :key="valueIndex"
                  >
                    <div class="col-10">
                      <b-form-group class="hi" label="Value" label-for="varientValue">
                        <b-form-input
                          id="varientValue"
                          v-model="varientSection.values[valueIndex].individualValue"
                        >
                       
                        </b-form-input>
                      </b-form-group>
                    </div>

                    <div class="col-2 col-sm-2">
                      <b-button
                        v-if="varientSection.values.length !== 1"
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
        <b-button variant="outline-primary mt-3" @click="addVarient()">+ Add Varient Option</b-button>
      </b-col>
    </b-row>
  </div>-->
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Array]
    },
    v: {
      type: Object
    }
  },

  mounted() {
    console.log(this.v);
  },

  methods: {
    addVarient() {
      console.log(this.v);
      this.$emit("addVarient");
    },

    addValue(varientIndex) {
      console.log(this.v);
      this.$emit("addValue", varientIndex);
    },

    removeValue(varientIndex, valueIndex) {
      console.log(this.v);
      this.$emit("removeValue", varientIndex, valueIndex);
    },

    deleteType(index) {
      console.log(this.v);
      this.$emit("deleteType", index);
    }
  }
};
</script>

<style>
.btn-delete-varient,
.btn-add-value {
  cursor: pointer;
}

.btn-delete-value {
  margin-top: 35px;
  width: 30px;
  height: 30px;
}
</style>
