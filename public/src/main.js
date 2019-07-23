"use strict";

import Vue from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App.vue";
import VueSession from "vue-session";
Vue.use(VueSession);
Vue.use(require("vue-cookies"));

new Vue({
   el: "app",
   components: { App },
   methods: {}
});
