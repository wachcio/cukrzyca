<template>
  <div class="containerForm">
    <form class="input-group mb-3">
      <input
        type="number"
        class="form-control"
        :class="{'alert alert-danger':$v.formAdd.sugar_level.$dirty && $v.formAdd.sugar_level.$invalid}"
        placeholder="poziom cukru"
        v-model="formAdd.sugar_level"
        @input="$v.formAdd.sugar_level.$touch()"
      />
      <input
        type="number"
        class="form-control"
        placeholder="dawka insuliny"
        v-model="formAdd.insulin_dose"
      />
      <input
        type="number"
        class="form-control"
        :class="{'alert alert-danger':$v.formAdd.hour_of_measurement.$dirty && $v.formAdd.hour_of_measurement.$invalid}"
        placeholder="godzina odczytu"
        v-model="formAdd.hour_of_measurement"
        @input="$v.formAdd.hour_of_measurement.$touch()"
      />
      <Datepicker
        v-model="formAdd.date_of_measurement"
        format="YYYY-MM-DD"
        lang="en"
        value-type="format"
      ></Datepicker>
      <button
        class="btn btn-primary btn__saveMeasurement"
        :disabled="$v.$invalid"
        @click="saveMeasurement()"
      >Zapisz odczyt</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "AddMeasurment",
  props: {},
  data() {
    return {
      formAdd: {
        sugar_level: "",
        insulin_dose: "",
        hour_of_measurement: "",
        date_of_measurement: ""
      }
    };
  },
  validations: {
    formAdd: {
      sugar_level: {
        between: between(10, 400)
      },
      insuli_dose: {
        between: between(0, 400)
      },
      hour_of_measurement: {
        required,
        between: between(1, 24)
      },
      date_of_measurement: {
        required
      }
    }
  },
  components: {
    Datepicker
  },
  methods: {
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV",
      "logoutV"
    ]),
    saveMeasurement: function() {
      let self = this;
      axios
        .post("/measurementAdd/", {
          ID_user: this.user.ID,
          sugar_level: this.formAdd.sugar_level,
          insulin_dose: this.formAdd.insulin_dose,
          hour_of_measurement: this.formAdd.hour_of_measurement,
          date_of_measurement: this.formAdd.date_of_measurement
        })
        .then(response => {
          this.getAllMeasurements();
          console.log(response);
        })
        .then(response => {
          this.currentPage = 2;
        })
        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    }
  },
  computed: {
    ...mapState(["measurements", "user"])
  },
  created() {
    this.formAdd.date_of_measurement = moment().format("YYYY-MM-DD");
  },
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
  width: 200px;
}
input,
.mx-Datepicker {
  width: 100% !important;
}
.btn__saveMeasurement {
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
</style>