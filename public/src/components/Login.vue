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
      <input class="btn btn-primary" type="submit" value="Login" />
    </form>
    <button class="btn btn-primary" @click="$emit('changeLoginData', true)">Coś</button>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "Login",
  props: { loginApp: Object },
  data() {
    return {};
  },
  components: {},
  methods: {
    loginHandle: function(e) {
      e.preventDefault();
      // console.log("this", this);

      this.$emit("changeLoginData", e.target.elements.login.value);
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
            console.log("Logged in");
            router.push("/dashboard");
          })
          .catch(errors => {
            // console.log(errors);

            console.log("Cannot log in");
          });
      };
      login();
    }
  },
  computed: {},
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>