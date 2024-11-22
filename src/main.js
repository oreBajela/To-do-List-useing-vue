import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import '@mdi/font/css/materialdesignicons.css';
Vue.use(Vuetify);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
