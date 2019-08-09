<template>
  <div>
    <h3>Dodaj użytkownika</h3>
    <div class="containerForm">
      <form class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          :class="{'alert alert-danger':$v.formAdd.first_name.$dirty && $v.formAdd.first_name.$invalid}"
          placeholder="Imię"
          v-model="formAdd.first_name"
          @input="$v.formAdd.first_name.$touch()"
        />
        <input
          type="text"
          class="form-control"
          :class="{'alert alert-danger':$v.formAdd.last_name.$dirty && $v.formAdd.last_name.$invalid}"
          placeholder="Nazwisko"
          v-model="formAdd.last_name"
          @input="$v.formAdd.last_name.$touch()"
        />
        <input
          type="text"
          class="form-control"
          :class="{'alert alert-danger':$v.formAdd.login.$dirty && $v.formAdd.login.$invalid}"
          placeholder="Login"
          v-model="formAdd.login"
          @input="$v.formAdd.login.$touch()"
        />
        <input
          type="password"
          class="form-control"
          :class="{'alert alert-danger':$v.formAdd.password.$dirty && $v.formAdd.password.$invalid}"
          placeholder="Hasło"
          v-model="formAdd.password"
          @input="$v.formAdd.password.$touch()"
        />
        <input
          type="password"
          class="form-control"
          :class="{'alert alert-danger':$v.formAdd.passwordRepeat.$dirty && $v.formAdd.passwordRepeat.$invalid}"
          placeholder="Powtórz hasło"
          v-model="formAdd.passwordRepeat"
          @input="$v.formAdd.passwordRepeat.$touch()"
        />
        <label>
          <input
            type="checkbox"
            class="form-control myCheckbox"
            :class="{'alert alert-danger':$v.formAdd.is_admin.$dirty && $v.formAdd.is_admin.$invalid}"
            v-model="formAdd.is_admin"
            @input="$v.formAdd.is_admin.$touch()"
          /> Prawa administratora
        </label>

        <Datepicker
          v-model="formAdd.date_of_birth_child"
          value-type="format"
          :lang="dateTimePicerOptions.lang"
        ></Datepicker>
        <button
          class="btn btn-primary btn__saveUser"
          :disabled="$v.$invalid"
          @click.prevent="saveUser()"
        >Zapisz odczyt</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between } from "vuelidate/lib/validators";
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
        is_admin: null,
        date_of_birth_child: null
      }
    };
  },
  validations: {
    formAdd: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      login: {
        required
      },
      password: {
        required
      },
      passwordRepeat: {
        required
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
}
.myCheckbox {
  width: 25px !important;
  height: 25px !important;
}
</style>