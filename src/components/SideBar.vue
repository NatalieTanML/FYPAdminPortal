<template>
  <b-collapse id="nav-collapse" visible>
    <ul id="accordionSidebar" class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div class="sidebar-brand-icon rotate-n-15">
          <i class="fas fa-laugh-wink"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Admin</div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider" />

      <li class="nav-item">
        <router-link to="SummaryOfOrders">
          <a class="nav-link">
            <!-- icon -->
            <i class="mr-2 fas fa-tachometer-alt"></i>
            <span>Orders</span>
          </a>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="DeliveryRoutes">
          <a class="nav-link">
            <!-- icon -->
            <i class="mr-2 fas fa-map-marked-alt"></i>
            <span>Delivery Routes</span>
          </a>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="Deliveries">
          <a class="nav-link">
            <!-- icon -->
            <i class="mr-2 fas fa-truck"></i>
            <span>Deliveries</span>
          </a>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="UserManagement">
          <a class="nav-link">
            <!-- icon -->
            <i class="mr-2 fas fa-users"></i>
            <span>User Management</span>
          </a>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="ResourceManagement">
          <a class="nav-link">
            <!-- icon -->
            <i class="mr-2 fas fa-cubes"></i>
            <span>Resource Management</span>
          </a>
        </router-link>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block" />
    </ul>
  </b-collapse>
  <!-- End of Sidebar -->
</template>

<script>
export default {
  name: "SideBar"
};
</script>

<style scoped>
li a:hover {
  text-decoration: none !important;
}
li a.router-link-active a.router-link-exact-active {
  font-weight: 700 !important;
  color: (255, 255, 255, 1);
}
</style>
