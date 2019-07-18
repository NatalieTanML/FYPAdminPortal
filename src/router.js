import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Login from "./views/Login";
import SummaryOfOrders from "./views/SummaryOfOrders";
import AddUser from "./views/AddUser";
import UserManagement from "./views/UserManagement";
import ChangePassword from "./views/ChangePassword";
import Deliveries from "./views/Deliveries";
import DeliveryRoutes from "./views/DeliveryRoutes";
import ResourceManagement from "./views/ResourceManagement";
import AddResource from "./views/AddResource";
import UpdateResource from "./views/UpdateResource";
import UpdateUser from "./views/UpdateUser";
import OrderDetails from "./views/OrderDetails";
import EditOrderDetails from "./views/EditOrderDetails";
import ErrorPage from "./views/Error";
import HotelManagement from "./views/HotelManagement";

import { eventBus } from "@/eventBus";

//3 roles: Admin, Store, Delivery
//Admin -> Every Page
//Store -> Nav Bar: Orders, Resource Management.
//Delivery -> Delivery Routes, Deliveries.

Vue.use(Router);

//I referred to an article on setting a default page when the app loads first time.
//https://alligator.io/vuejs/intro-to-routing/
let router = new Router({
  routes: [
    {
      path: "/Login",
      name: "Login",
      component: Login,
      meta: {
        needAuthentication: false
      }
    },
    {
      path: "/",
      name: "",
      component: Login,
      meta: {
        needAuthentication: false
      }
    },
    {
      path: "/SummaryOfOrders",
      name: "SummaryOfOrders",
      component: SummaryOfOrders,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/AddUser",
      name: "AddUser",
      component: AddUser,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/UserManagement",
      name: "UserManagement",
      component: UserManagement,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/ChangePassword",
      name: "ChangePassword",
      component: ChangePassword,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },

    {
      path: "/Deliveries",
      name: "Deliveries",
      component: Deliveries,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/ResourceManagement",
      name: "ResourceManagement",
      component: ResourceManagement,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/AddResource",
      name: "AddResource",
      component: AddResource,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/UpdateResource",
      name: "UpdateResource",
      component: UpdateResource,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/DeliveryRoutes",
      name: "DeliveryRoutes",
      component: DeliveryRoutes,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/UpdateUser",
      name: "UpdateUser",
      component: UpdateUser,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/OrderDetails",
      name: "OrderDetails",
      component: OrderDetails,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/EditOrderDetails",
      name: "EditOrderDetails",
      component: EditOrderDetails,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/HotelManagement",
      name: "HotelManagement",
      component: HotelManagement,
      meta: {
        needAuthentication: true,
        needNewPassword: true
      }
    },
    {
      path: "/Error",
      name: "Error",
      component: ErrorPage,
      meta: {}
    },
    {
      path: "*",
      name: "404",
      component: ErrorPage
    }
  ]
});

//router.beforeEach will help in checking whether
//user has logged in or not.
//reference : https://router.vuejs.org/guide/advanced/meta.html

router.beforeEach((to, from, next) => {
  console.log("token: " + store.getters.isAuthenticated);

  // let resolved = router.resolve(to.path)
  //  if(resolved.route.name != '404')
  // console.log("resolve")

  console.log("change password: " + store.getters.changePassword);

  console.log("To : " + to.name);

  console.log("From : " + from.name);

  localStorage.setItem("previousPathName", from.name);

  //if people try to go to the login page after they logged in,
  //they will be redirected to summaryoforders
  if (
    store.getters.isAuthenticated &&
    to.path == "/Login" &&
    store.getters.changePassword
  ) {
    if (store.getters.userRole == "Admin" || store.getters.userRole == "Store")
      next({
        path: "/SummaryOfOrders"
      });
    else
      next({
        path: "/Deliveries"
      });
  }

  // //if they are logged in already, and have changed their password,
  // //they cant access the changepassword page again.
  // else if(store.getters.isAuthenticated && to.path == '/ChangePassword' && store.getters.changePassword){
  //   console.log("second if")
  //   next({
  //     path: '/SummaryOfOrders',
  //   })
  // }

  //start of validation pages that needs authentication.
  //if user is authenticated, it will validate whether the page he is going is
  //allowed, or else it will just route him back to login page.
  else if (
    to.matched.some(record => record.meta.needAuthentication) &&
    store.getters.isAuthenticated
  ) {
    //validate pages which user needs to change his password before he can access the page.
    //example: he has logged in, but has not change his password, he will be redirected to the
    //change password page.
    if (to.matched.some(record => record.meta.needNewPassword)) {
      //if user needs to change password.
      if (!store.getters.changePassword && to.path != "/ChangePassword") {
        next({
          path: "/ChangePassword"
          //params: { nextUrl: to.fullPath }
        });
      } else if (store.getters.userRole != null) {
        //check for roles.

        if (store.getters.userRole == "Admin") next();
        else if (store.getters.userRole == "Store") {
          if (
            to.path == "/SummaryOfOrders" ||
            to.path == "/ResourceManagement" ||
            to.path == "/OrderDetails" ||
            to.path == "/Login" ||
            to.path == "/ChangePassword"
          )
            next();
          else
            next({
              path: "/SummaryOfOrders"
            });
        } else if (store.getters.userRole == "Delivery") {
          if (
            to.path == "/Deliveries" ||
            to.path == "/Login" ||
            to.path == "/ChangePassword"
          )
            next();
          else {
            next({
              path: "/Deliveries"
            });
          }
        } else next();
      } else next();
    } else next();
  } else {
    if (to.path != "/Login") {
      next({
        path: "/Login"
      });
    } else {
      next();
    }
  }

  //if admin leaves the updateuser page, updateuser page will reset.
  if (to.name != "UpdateUser" && localStorage.getItem("updateUserId") != null)
    localStorage.setItem("updateUserId", null);

  //if people try to access the updateuser page by typing in the url, it will just
  //redirect them to usermanagement
  if (to.name == "UpdateUser" && localStorage.getItem("updateUserId") == "null")
    next({ path: "/UserManagement" });

  //if admin leaves the orderdetails page, orderdetails page will reset.
  if (to.name != "OrderDetails" && localStorage.getItem("viewOrderId") != null)
    localStorage.setItem("viewOrderId", null);

  //if people try to access the orderdetails page by typing in the url, it will just
  //redirect them to summaryofOrders
  if (
    to.name == "OrderDetails" &&
    localStorage.getItem("viewOrderId") == "null"
  )
    next({ path: "/SummaryOfOrders" });

  //if admin leaves the editorderdetails page, editorderdetails page will reset.
  if (
    to.name != "EditOrderDetails" &&
    localStorage.getItem("editOrderId") != null
  )
    localStorage.setItem("editOrderId", null);

  //if people try to access the editorderdetails page by typing in the url, it will just
  //redirect them to summaryofOrders
  if (
    to.name == "EditOrderDetails" &&
    localStorage.getItem("editOrderId") == "null"
  )
    next({ path: "/SummaryOfOrders" });

  if (from.name == "SummaryOfOrders") {
    //the reason why i have to eventbus.off these variable is because
    //the eventbus listener will be generated everytime user enters the
    //summaryoforders page.
    //https://stackoverflow.com/questions/49484390/eventbus-is-listening-duplicate-events-when-component-is-loaded-multiple-times/49526856
    //eventbus.once doesnt work because then the button can only be clicked once. then it will be "disabled."

    //since summaryoforders have multiple headers, need to reset each listender for the headers.
    let index;
    for (
      index = 0;
      index < SummaryOfOrders.data().headerButtonClick.length;
      index++
    ) {
      eventBus.$off(SummaryOfOrders.data().headerButtonClick[index]);
    }
    eventBus.$off(SummaryOfOrders.data().actionButtonClick);
    eventBus.$off(SummaryOfOrders.data().imageClick);
    eventBus.$off("cancelOrder");
  }

  if (from.name == "Deliveries") {
    for (
      var index = 0;
      index < Deliveries.data().headerButtonClick.length;
      index++
    ) {
      eventBus.$off(Deliveries.data().headerButtonClick[index]);
    }
    eventBus.$off(Deliveries.data().actionButtonClick);
  }
});

export default router;
