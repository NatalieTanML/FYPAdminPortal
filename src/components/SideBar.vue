<template>
     <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div class="sidebar-brand-icon rotate-n-15">
          <i class="fas fa-laugh-wink"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Admin</div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider">

      
      <li class="nav-item">
        <a class="nav-link collapsed"  >
          <!-- icon -->
          <i class="fas fa-fw fa-cog"></i>
          <span>Orders</span>
        </a>
      </li>

      <li class="nav-item">
        <a class="nav-link collapsed"  >
          <!-- icon -->
          <i class="fas fa-fw fa-cog"></i>
          <span>Delivery Routes</span>
        </a>
      </li>

      <li class="nav-item">
         <router-link to="deliveries">
        <a class="nav-link collapsed"  >
          <!-- icon -->
          <i class="fas fa-fw fa-cog"></i>
          <span>Deliveries</span>
        </a>
        </router-link>
      </li>
      

       <li class="nav-item">
        <a class="nav-link collapsed"  >
          <!-- icon -->
          <i class="fas fa-fw fa-cog"></i>
          <span>User Management</span>
        </a>
      </li>

       <li class="nav-item">
        <a class="nav-link collapsed"  >
          <!-- icon -->
          <i class="fas fa-fw fa-cog"></i>
          <span>Resource Management</span>
        </a>
      </li>


      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block">

     
    </ul>
    <!-- End of Sidebar -->
</template>

<script>

export default {
name: 'SideBar'
}
</script>

<style>

</style>
