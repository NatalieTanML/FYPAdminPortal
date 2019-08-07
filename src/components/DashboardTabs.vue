<template>
  <div class="ml-3">
    <div class="card shadow align-items-center">
      <!-- isDark changes the color of the tabs. -->
      <li :class="[ isDark ? 'background-dark' : 'background-light' ]" class="nav-item">
        <a class="nav-link" style="cursor:pointer">
          <span :class="[ isDark ? 'font-dark' : 'font-light' ]" style="font-size:0.9em">{{title}}<span v-if="noOfRows != null"> ({{noOfRows}})</span></span>
        </a>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardTabs",
  props: {
    title: String,
    isDark: Boolean,
    tabId: String,
    noOfRows:  Number,
  },
  data(){
    return{
     noOfRowsString: "",
    }
  },
 
};
</script>

<style>
.background-dark {
  border-radius: 0.25rem;
  background-color: #4e72dd;
}
.background-light {
}
.font-dark {
  color: white;
}
.font-light {
  color: #4e72dd;
}

</style>