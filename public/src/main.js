"use strict";

import Vue from "vue";
// import "./plugins/bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App.vue";
import router from "./router";
import VueSession from "vue-session";

import Vuelidate from "vuelidate";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTrashAlt);
library.add(faCheck);
library.add(faPen);
Vue.use(VueSession);
Vue.use(Vuelidate);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(require("vue-cookies"));

new Vue({
   el: "app",
   router,
   components: { App },
   methods: {}
});
