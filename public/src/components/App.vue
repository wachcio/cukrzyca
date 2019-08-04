<template>
  <div id="app">
    <div class="btn-group" role="group">
      <router-link
        :to="{ name: 'dashboardAddMeasurement'}"
        class="btn btn-secondary"
      >{{dashboardTitle}}</router-link>
      <router-link v-if="!user.online" :to="{ name: 'Login'}" class="btn btn-secondary">Login</router-link>
      <a href="#" v-if="user.online" @click="logout" class="btn btn-secondary">Logout</a>
    </div>
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import bus from "./../bus.js";
import router from "../router";

import cookieSession from "cookie-session";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "app",
  data() {
    return {
      // login: {
      //   login: "",
      //   online: false,
      //   urlLogin: "/login",
      //   name: ""
      // }
    };
  },
  components: {},
  computed: {
    ...mapState(["measurements", "user"]),
    // ...mapGetters(),
    dashboardTitle: function() {
      return this.user.online
        ? `Panel użytkownika - ${this.user.name}`
        : `Panel użytkownika `;
    }
  },
  methods: {
    // ...mapActions(),
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV",
      "logoutV"
    ]),
    logout: function(e) {
      axios
        .get("/logout")
        .then(() => {
          router.push("/");
        })
        .then(() => {
          this.logoutV();
          // this.user.online = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {}
};
</script>

<style>
body {
  margin: 20px !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
