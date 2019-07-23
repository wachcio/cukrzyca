<template>
  <div id="app">
    <h2
      class="text-center"
    >Witam na stronie na której dodasz a później wydrukujesz raport tygodniowy z pomiarów cukru</h2>
    <div class="container d-flex justify-content-center">
      <form v-if="!login.online">
        <div class="form-group">
          <label for="login">Login</label>
          <input type="text" class="form-control" id="login" name="login" v-model="login.login" />
        </div>
        <div class="form-group">
          <label for="password">Hasło</label>
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            v-model="login.password"
          />
        </div>

        <button class="btn btn-primary" v-on:click.prevent="onSubmit">Wyślij</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import bus from "./../bus.js";

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
