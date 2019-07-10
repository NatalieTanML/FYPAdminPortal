import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import order from "./modules/order";
import product from "./modules/product";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    order,
    user,
    product
  },
  strict: debug
});
