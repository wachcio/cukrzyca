<template>
  <div id="app">
    <h2
      class="text-center"
    >Witam na stronie na której dodasz a później wydrukujesz raport tygodniowy z pomiarów cukru</h2>
    <div>
      <router-link :to="{ name: 'Dashboard'}">Panel użytkownika</router-link>
      <router-link :to="{ name: 'Login'}">Login</router-link>
      <a href="#" v-on:click="logout">Logout</a>
    </div>
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import bus from "./../bus.js";
import router from "../router";

import cookieSession from "cookie-session";

export default {
  name: "app",
  data() {
    return {
      login: {
        login: "",
        password: "",
        online: false,
        urlLogin: "/login",
        userOnline: {}
      }
    };
  },
  components: {},
  methods: {
    logout: function(e) {
      axios.get("/logout").then(() => {
        router.push("/");
      });
    },
    onSubmit(e) {
      axios
        .post(this.login.urlLogin, {
          login: this.login.login,
          password: this.login.password
        })
        .then(res => {
          this.login.online = true;
          this.login.userOnline = res.data;
          this.$session.start();
          console.log("sesja", this.$session.getAll());

          for (const prop in res.data) {
            console.log(res.data[prop]);

            this.$cookies.set(prop, res.data[prop]);
          }
          console.log("ciastka", this.$cookies.keys());

          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
