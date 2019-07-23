<template>
  <div class="container d-flex justify-content-center">
    <form v-on:submit="login">
      <div class="form-group">
        <label for="login">Login</label>
        <input type="text" class="form-control" id="login" name="email" v-model="login.login" />
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
      <input class="btn btn-primary" type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "Login",
  props: {},
  data() {
    return {};
  },
  components: {},
  methods: {
    login: e => {
      e.preventDefault();
      let email = e.target.elements.email.value;
      let password = e.target.elements.password.value;
      let login = () => {
        let data = {
          email: email,
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