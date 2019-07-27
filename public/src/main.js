"use strict";

import Vue from "vue";
// import "./plugins/bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App.vue";
import router from "./router";
import VueSession from "vue-session";
Vue.use(VueSession);
Vue.use(require("vue-cookies"));

new Vue({
   el: "app",
   router,
   components: { App },
   methods: {}
});
