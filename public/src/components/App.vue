<template>
  <div id="app">
    <div class="btn-group" role="group">
      <router-link :to="{ name: 'Dashboard'}" class="btn btn-secondary">{{dashboardTitle}}</router-link>
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
    // onSubmit(e) {
    //   axios
    //     .post(this.login.urlLogin, {
    //       login: this.login.login,
    //       password: this.login.password
    //     })
    //     .then(res => {
    //       this.login.online = true;
    //       this.login.userOnline = res.data;
    //       this.$session.start();
    //       console.log("sesja", this.$session.getAll());

    //       for (const prop in res.data) {
    //         console.log(res.data[prop]);

    //         this.$cookies.set(prop, res.data[prop]);
    //       }
    //       console.log("ciastka", this.$cookies.keys());

    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // changeLoginData: function(payload) {
    //   console.log(payload);
    //   this.login.login = payload;
    // }
  },
  mounted() {
    // this.$router.app.$on("changeLoginData", payload => {
    // this.login.login = payload.login.value;
    // this.login.password = payload.password.value;
    // this.login.online = true;
    // });
  }
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
