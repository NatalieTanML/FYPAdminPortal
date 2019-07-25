<template>
  <form>
    <div class="radio-button">
      <b-form-group id="discountType" label-cols-sm="3" label="Type" label-for="input-horizontal">
        <b-form-radio-group
          id="discountType"
          class="individual-button"
          buttons
          button-variant="outline-secondary"
          v-model="value.discountType"
          :options="discountOptions"
        ></b-form-radio-group>
      </b-form-group>
    </div>

    <b-form-group id="discountValue" label-cols-sm="3" label="Value" label-for="input-horizontal">
      <b-form-input
        id="discountValue"
        v-model="v.discountValue.$model"
        :state="v.discountValue.$dirty ? !v.discountValue.$error : null"
        maxlength="7"
      ></b-form-input>

      <b-form-invalid-feedback>
        <p v-if="!v.discountValue.required">Discount value is required</p>
        <p v-if="!v.discountValue.twoDecimal">Please enter a numerical amount up to 2 decimal places</p>
        <p
          v-if="!v.discountValue.maxPercentageValue"
        >Please enter a valid amount greater than 0 and less than or equal to 100.</p>
        <p
          v-if="!v.discountValue.maxFixedValue"
        >Please enter a valid amount greater than 0 and less than or equal to the base price</p>
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      id="discountStartDate"
      label-cols-sm="3"
      label="Start Date"
      label-for="input-horizontal"
    >
      <datepicker
        :id="(!v.effectiveStartDate.$dirty) ? 'startDate' : (v.effectiveStartDate.$error) ? 'date-invalid' : 'date-valid' "
        :value="datePicker.date"
        :bootstrap-styling="datePicker.style"
        :format="datePicker.format"
        :placeholder="datePicker.placeHolder"
        v-model="v.effectiveStartDate.$model"
        :class="(!v.effectiveStartDate.$dirty) ? null : (v.effectiveStartDate.$error) ? 'is-invalid-icon' : 'is-valid-icon' "
      ></datepicker>

      <div v-if="v.effectiveStartDate.$dirty" class="date-invalid-feedback">
        <div v-if="!v.effectiveStartDate.required">Start Date is required</div>
        <div v-if="!v.effectiveStartDate.checkDate">Start date must not be greater than end date</div>
        <div
          v-if="!v.effectiveStartDate.overlapFound"
        >Current discount date overlapped with existing record(s)</div>
        <div v-if="!v.effectiveStartDate.checkStartDate">
          <p>Start date must not be lesser than base start date</p>
        </div>
      </div>
    </b-form-group>

    <b-form-group
      id="discountEndDate"
      label-cols-sm="3"
      label="End Date"
      label-for="input-horizontal"
    >
      <datepicker
        :id="(!v.effectiveEndDate.$dirty) ? 'endDate' : (v.effectiveEndDate.$error) ? 'date-invalid' : 'date-valid' "
        :value="datePicker.date"
        :bootstrap-styling="datePicker.style"
        :clear-button="true"
        :format="datePicker.format"
        :placeholder="datePicker.placeHolder"
        :disabledDates="disabledDiscountDates()"
        v-model="v.effectiveEndDate.$model"
        :class="(!v.effectiveEndDate.$dirty) ? null : (v.effectiveEndDate.$error) ? 'is-invalid-icon' : 'is-valid-icon' "
      ></datepicker>

      <div v-if="v.effectiveEndDate.$dirty" class="date-invalid-feedback">
        <div v-if="!v.effectiveEndDate.checkEndDate">End date must not be greater than base end date</div>
      </div>
    </b-form-group>
  </form>
</template>

<script>
import Datepicker from "vuejs-datepicker";
export default {
  props: {
    value: {
      type: Object,
      default: ""
    },
    v: {
      type: Object,
      required: true
    }
  },
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
  },
  methods: {
    // Disable previous dates for discount end date according to selected discount start date
    disabledDiscountDates() {
      let startDate = this.value.effectiveStartDate;
      if (typeof startDate === "string") {
        startDate = new Date(startDate);
      }
      let disabledDates = {};
      disabledDates.to = new Date(startDate - 8640000);
      return disabledDates;
    }
  }
};
</script>

<style>
</style>
