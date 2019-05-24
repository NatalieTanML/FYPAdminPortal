import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Login from "./views/Login";
import SummaryOfOrders from "./views/SummaryOfOrders";
import AddUser from "./views/AddUser";
import ManageUser from "./views/ManageUser";
import ChangePassword from "./views/ChangePassword";
import Dashboard from "./views/Dashboard";
import Deliveries from "./views/Deliveries";
import DeliveryRoutes from "./views/DeliveryRoutes";

Vue.use(Router);

//I referred to an article on setting a default page when the app loads first time.
//https://alligator.io/vuejs/intro-to-routing/
let router = new Router({
  data() {
    return {
      break: true
    };
  },

  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      meta: {
        //haveNotChangePassword refers to pages which user can access even though he have not changed
        //his/her password.
        haveNotChangePassword: true
      }
    },
    {
      path: "/Login",
      name: "Login",
      component: Login,
      meta: {
        //haveNotChangePassword refers to pages which user can access even though he have not changed
        //his/her password.
        haveNotChangePassword: true
      }
    },
    {
      path: "/SummaryOfOrders",
      name: "SummaryOfOrders",
      component: SummaryOfOrders,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/AddUser",
      name: "AddUser",
      component: AddUser,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/ManageUser",
      name: "ManageUser",
      component: ManageUser,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/ChangePassword",
      name: "ChangePassword",
      component: ChangePassword,
      meta: {
        requiresAuth: true,
        //haveNotChangePassword refers to pages which user can access even though he have not changed
        //his/her password.
        haveNotChangePassword: true
      }
    },
    {
      path: "/Dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {}
    },
    {
      path: "/Deliveries",
      name: "Deliveries",
      component: Deliveries,
      meta: {}
    },
    {
      path: "/DeliveryRoutes",
      name: "DeliveryRoutes",
      component: DeliveryRoutes,
      meta: {}
    }
  ]
});

//router.beforeEach will help in checking whether
//user has logged in or not.
//reference : https://router.vuejs.org/guide/advanced/meta.html

// router.beforeEach((to, from, next) => {
//   console.log("store getter change password"+store.getters.changePassword)

//  if(to.matched.some(record => record.meta.requiresAuth)) {
//    console.log("requiresAuth")
//     //to check if user is authenticated.

//     //if user needs to change password,
//     //they will be redirected to the changepassword page.

//     if (!store.getters.isAuthenticated) {
//       console.log("not authenticated")
//       next({
//           path: '/Login',
//           //params: { nextUrl: to.fullPath }
//       })
//   }
//   else{
//     console.log("authenticated")

//     if(store.getters.changePassword || to.matched.some(record => record.meta.haveNotChangePassword))
//     next()

//     else if(!to.matched.some(record => record.meta.haveNotChangePassword) && !store.getters.changePassword)
//     {
//       console.log("second if statement")
//       next({ path: '/ChangePassword'})

//     }
//     else{
//       console.log("third selse statement")
//     next()
//     }
// }

//  }
//  else
//   next()

// })

export default router;
