import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import BootstrapVue from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
require("./assets/styles/sb-admin-2.css");
import Vuelidate from "vuelidate";
import VueSnackbar from "vue-snack";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-multiselect/dist/vue-multiselect.min.css"
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import VueSignaturePad from 'vue-signature-pad';


require("vue-snack/dist/vue-snack.min.css");

Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.use(VueSnackbar);
Vue.use(VueSignaturePad);


// Vue.use(Notifications)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
