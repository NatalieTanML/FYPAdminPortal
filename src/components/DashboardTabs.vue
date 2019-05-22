<template>
  <div class="ml-3">
    <div class="card shadow align-items-center">
      <li :class="[ isDark ? 'background-dark' : 'background-light' ]" class="nav-item">
        <a class="nav-link" href="#">
          <span :class="[ isDark ? 'font-dark' : 'font-light' ]">{{title}}</span>
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
    tabId: String
  }
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