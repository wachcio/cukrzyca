<template>
  <div>
    <h3>Dodaj użytkownika</h3>
    <div class="containerForm">
      <form class="input-group mb-3">
        <div class="form-group">
          <label for="first_name">Imię</label>
          <input
            type="text"
            class="form-control"
            :class="{'alert alert-danger':$v.formAdd.first_name.$dirty && $v.formAdd.first_name.$invalid}"
            placeholder="Imię"
            id="first_name"
            v-model="formAdd.first_name"
            @input="$v.formAdd.first_name.$touch()"
          />
        </div>
        <div class="form-group">
          <label for="last_name">Nazwisko</label>
          <input
            type="text"
            class="form-control"
            :class="{'alert alert-danger':$v.formAdd.last_name.$dirty && $v.formAdd.last_name.$invalid}"
            placeholder="Nazwisko"
            id="last_name"
            v-model="formAdd.last_name"
            @input="$v.formAdd.last_name.$touch()"
          />
        </div>
        <div class="form-group">
          <label for="login">Login</label>
          <input
            type="text"
            class="form-control"
            :class="{'alert alert-danger':$v.formAdd.login.$dirty && $v.formAdd.login.$invalid}"
            placeholder="Login"
            id="login"
            v-model="formAdd.login"
            @input="$v.formAdd.login.$touch()"
          />
        </div>
        <div class="form-group">
          <label for="password">Hasło</label>
          <input
            type="password"
            class="form-control"
            :class="{'alert alert-danger':$v.formAdd.password.$dirty && $v.formAdd.password.$invalid}"
            placeholder="Hasło"
            id="password"
            v-model="formAdd.password"
            @input="$v.formAdd.password.$touch()"
          />
        </div>
        <div class="form-group">
          <label for="passwordRepeat">Powtórz hasło</label>
          <input
            type="password"
            class="form-control"
            :class="{'alert alert-danger':$v.formAdd.passwordRepeat.$dirty && $v.formAdd.passwordRepeat.$invalid}"
            placeholder="Powtórz hasło"
            id="passwordRepeat"
            v-model="formAdd.passwordRepeat"
            @input="$v.formAdd.passwordRepeat.$touch()"
          />
        </div>
        <div class="form-group">
          <label for="date_of_birth_child">Data spodziewanego porodu</label>
          <Datepicker
            v-model="formAdd.date_of_birth_child"
            value-type="format"
            id="date_of_birth_child"
            :lang="dateTimePicerOptions.lang"
          ></Datepicker>
        </div>
        <div class="form-group">
          <label>
            <input
              type="checkbox"
              class="form-control myCheckbox"
              :class="{'alert alert-danger':$v.formAdd.is_admin.$dirty && $v.formAdd.is_admin.$invalid}"
              v-model="formAdd.is_admin"
              @input="$v.formAdd.is_admin.$touch()"
            /> Prawa administratora
          </label>
        </div>
        <div class="form-group">
          <button
            class="btn btn-primary btn__saveUser"
            :disabled="$v.$invalid"
            @click.prevent="saveUser()"
          >Zapisz użytkownika</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between, sameAs } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "AdminAddUser",
  props: {},
  data() {
    return {
      formAdd: {
        first_name: null,
        last_name: null,
        password: null,
        passwordRepeat: null,
        login: null,
        is_admin: 0,
        date_of_birth_child: null
      }
    };
  },
  validations: {
    formAdd: {
      first_name: {
        required,
        minLength: minLength(4)
      },
      last_name: {
        required,
        minLength: minLength(4)
      },
      login: {
        required,
        minLength: minLength(4)
      },
      password: {
        required,
        minLength: minLength(6)
      },
      passwordRepeat: {
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs("password")
      },
      is_admin: {
        required
      },
      date_of_birth_child: {
        required
      }
    }
  },
  components: { Datepicker },
  methods: {
    saveUser: function() {
      let self = this;
      let isAdminFixed = 0;
      if (this.formAdd.is_admin) isAdminFixed = 1;

      axios
        .post("/user/", {
          first_name: this.formAdd.first_name,
          last_name: this.formAdd.last_name,
          login: this.formAdd.login,
          password: this.formAdd.password,
          is_admin: isAdminFixed,
          date_of_birth_child: this.formAdd.date_of_birth_child
        })
        .then(response => {
          self.$router.push({ name: "adminEditUser" });
        })
        .then(response => {
          this.getAllMeasurements();
          // console.log(response);
        })

        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    }
  },
  computed: { ...mapState(["dateTimePicerOptions"]) },
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  flex-basis: 200px;
  padding-top: 20px;
}
.containerForm {
  width: 250px;
}
.form-control,
.mx-datepicker {
  width: 100% !important;
  padding: 0;
  margin: 0;
}
.btn__saveUser {
  margin-top: 20px;
}
.confirm {
  width: 200px;
}
.tdEnd {
  text-align: end;
}
.report__container {
  width: 200px;
}
label {
  display: flex;
  margin-bottom: 2px;
  margin-top: 2px;
}
.myCheckbox {
  width: 25px !important;
  height: 25px !important;
}
</style>