import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
require('./assets/styles/sb-admin-2.css')
import Vuelidate from 'vuelidate';
import VueSnackbar from 'vue-snack';


require("vue-snack/dist/vue-snack.min.css");

Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.use(VueSnackbar);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
