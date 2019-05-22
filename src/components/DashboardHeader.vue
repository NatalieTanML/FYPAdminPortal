<template>
  <div class="ml-2">
    <h4>{{title}}</h4>
  </div>
</template>

<script>
export default {
  name: "DashboardHeader",
  props: {
    title: String
  }
};
</script>