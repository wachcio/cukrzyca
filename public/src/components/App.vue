<template>
  <div id="app">
    <div class="btn-group" role="group">
      <router-link :to="{ name: 'Dashboard'}" class="btn btn-secondary">Panel użytkownika</router-link>
      <router-link
        :to="{ name: 'Login'}"
        class="btn btn-secondary"
        :loginApp="login"
        @changeLoginData="changeLoginData"
      >Login</router-link>
      <a href="#" @click="logout" class="btn btn-secondary">Logout</a>
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
    },
    changeLoginData: function(payload) {
      console.log(payload);
      this.login.login = payload;
    }
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
