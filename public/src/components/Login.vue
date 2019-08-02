<template>
  <div class="container d-flex justify-content-center">
    <form v-on:submit="loginHandle">
      <div class="form-group">
        <label for="login">Login</label>
        <input type="text" class="form-control" id="login" name="login" />
      </div>
      <div class="form-group">
        <label for="password">Hasło</label>
        <input type="password" class="form-control" id="password" name="password" />
      </div>
      <div class="alert alert-danger" role="alert" v-if="error.error">{{error.message}}</div>

      <input class="btn btn-primary" type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Login",
  props: { loginApp: Object },
  data() {
    return {
      error: {
        message: "",
        error: false
      }
    };
  },
  components: {},
  methods: {
    // ...mapActions(),
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV"
    ]),
    loginHandle: function(e) {
      e.preventDefault();
      // console.log("this", this);

      let login2 = e.target.elements.login.value;
      let password = e.target.elements.password.value;
      let login = () => {
        let data = {
          login: login2,
          password: password
        };
        axios
          .post("/login", data)
          .then(response => {
            // console.log("Logged in");
            this.error.error = false;
            this.error.message = "";

            console.log("res User", e.target.elements);
            router.push("/dashboard");
          })
          .catch(errors => {
            console.log(errors);
            this.error.error = true;
            this.error.message = "Złe hasło lub login";
            console.log("Cannot log in");
          });
      };
      login();
    }
  },
  computed: {
    ...mapState(["measurements"])
    // ...mapGetters(),
  },
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>