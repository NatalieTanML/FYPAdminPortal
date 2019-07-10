<template>
  <form>
    <div class="radio-button">
      <b-form-group id="discountType" label-cols-sm="3" label="Type" label-for="input-horizontal">
        <b-form-radio-group
          id="discountType"
          class="individual-button"
          buttons
          button-variant="outline-secondary"
          v-model="value.discount.discountType"
          :options="discountOptions"
        ></b-form-radio-group>
      </b-form-group>
    </div>

    <b-form-group id="discountValue" label-cols-sm="3" label="Value" label-for="input-horizontal">
      <b-form-input id="discountValue" v-model="value.discount.discountValue"></b-form-input>
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
        v-model="value.discount.effectiveStartDate"
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
        v-model="value.discount.effectiveEndDate"
        required
      ></datepicker>
    </b-form-group>
  </form>
</template>

<script>
import Datepicker from "vuejs-datepicker";
export default {
  props: ["value"],
  components: {
    Datepicker
  },
  data() {
    return {
      discountOptions: ["Percentage", "Fixed"],
      datePicker: {
        style: true,
        format: "yyyy-MM-dd"
      }
    };
  }
};
</script>

<style>
</style>
