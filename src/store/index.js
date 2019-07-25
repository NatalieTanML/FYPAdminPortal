import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import order from "./modules/order";
import product from "./modules/product";
import hotel from "./modules/hotel";
import persistedState from "vuex-persistedstate";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  plugin: [persistedState],
  modules: {
    order,
    user,
    product,
    hotel
  },
  strict: debug
});
