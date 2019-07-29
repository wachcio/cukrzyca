<template>
  <div>
    <h3>Panel użytkownika {{ user.name }}</h3>
    <div class="btn-group" role="group">
      <button class="btn btn-secondary" @click="currentPage = 1">Dodaj odczyt</button>
      <button class="btn btn-secondary" @click="currentPage = 2">Odczyty</button>
      <button class="btn btn-secondary" @click="currentPage = 3">Raport</button>
    </div>
    <div v-show="currentPage == 1">
      <div class="input-group mb-3">
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
        <datepicker
          v-model="formAdd.date_of_measurement"
          format="YYYY-MM-DD"
          lang="en"
          value-type="format"
        ></datepicker>
        <button
          class="btn btn-primary"
          :disabled="$v.$invalid"
          @click="saveMeasurement()"
        >Zapisz odczyt</button>
      </div>
      <!-- <pre>{{$v}}</pre> -->
    </div>

    <div v-show="currentPage == 2">
      <h3>Odczyty</h3>
      <table class="table table-striped table-hover" v-if="measurements" id="measurementsTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <!-- <th scope="col">ID</th> -->
            <th scope="col">Poziom cukru</th>
            <th scope="col">Dawka insuliny</th>
            <th scope="col">Godzina pomiaru</th>
            <th scope="col">Data pomiaru</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(measurement, index) in measurements" :key="measurement.ID">
            <th scope="row">{{index+1}}</th>
            <!-- <td>{{measurement.ID}}</td> -->
            <td v-html="td(measurement, 'sugar_level', 'number')"></td>
            <td v-html="td(measurement, 'insulin_dose', 'number')"></td>
            <td v-html="td(measurement, 'hour_of_measurement', 'number')"></td>
            <td v-html="td(measurement, 'date_of_measurement', 'text')"></td>
            <td class="tdEnd">
              <div v-show="edit.ID" class="btn">
                &nbsp;
                <font-awesome-icon size="lg" />
              </div>
              <div v-show="!edit.ID" class="btn btn-primary" @click="editMeasurement(measurement)">
                <font-awesome-icon icon="pen" size="lg" @click="editMeasurement(measurement)" />
              </div>
              <div v-show="!edit.ID" class="btn btn-danger" @click="deleteMeasurement(measurement)">
                <font-awesome-icon
                  icon="trash-alt"
                  size="lg"
                  @click="deleteMeasurement(measurement)"
                />
              </div>

              <div
                v-show="edit.ID == measurement.ID"
                class="btn btn-success"
                @click="saveEditMeasurement(measurement.ID)"
              >
                <font-awesome-icon icon="check" size="lg" />
              </div>
              <div
                v-show="edit.ID == measurement.ID"
                class="btn btn-danger"
                @click="edit.ID = null"
              >
                <font-awesome-icon icon="times" size="lg" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="currentPage == 3">
      <p>Raport od dnia</p>
      <datepicker v-model="dateFrom" format="YYYY-MM-DD" lang="en" value-type="format"></datepicker>
      <a :href="urlReport" target="_blanc" class="btn btn-primary">Generuj</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between } from "vuelidate/lib/validators";

export default {
  name: "Dashboard",
  data() {
    return {
      user: {
        name: ""
      },
      dateFrom: "",
      measurements: "",
      currentPage: "",
      edit: {
        ID: "",
        sugar_level: "",
        insulin_dose: "",
        hour_of_measurement: "",
        date_of_measurement: ""
      },
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
        required,
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
    getUserData: function() {
      let self = this;
      axios
        .get("/user")
        .then(response => {
          //   console.log(response);
          self.$set(this, "user", response.data.user);
          //   this.formAdd.ID = response.data.user;
        })
        .then(response => {
          this.getAllMeasurements();
        })
        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    },
    getAllMeasurements: function() {
      let self = this;
      axios
        .get("/measurementsUser/" + this.user.ID)
        .then(response => {
          //   console.log(response);
          self.$set(this, "measurements", response.data);
        })
        .then(response => {
          this.pages;
        })
        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    },
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
    },
    customFormat: function(date) {
      return moment(date).format("YYYY-MM-DD");
      //   return "DD-MM-YYYY";
    },
    editMeasurement: function(m) {
      this.edit.ID = m.ID;
    },
    deleteMeasurement: function(m) {
      if (
        confirm(
          "Czy jesteś pewien, że chcesz usunąć ten odczyt \nPoziom cukru: " +
            m.sugar_level +
            "\nDawka insuliny: " +
            m.insulin_dose +
            "\nGodzina pomiaru: " +
            m.hour_of_measurement +
            "\nData pomiaru: " +
            m.date_of_measurement +
            "?"
        )
      ) {
        axios
          .delete("/measurementDelete/", { params: { ID: m.ID } })
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
    td: function(m, mField, inputType) {
      // edit.ID == measurement.ID ? "edycja" : {{measurement.sugar_level}}
      this.edit[mField] = m[mField];

      return this.edit.ID == m.ID
        ? `<input type="${inputType}" value="${m[mField]}"/>`
        : m[mField];
    },
    saveEditMeasurement: function(ID) {
      for (var member in this.edit) delete this.edit[member];
    }
  },
  computed: {
    urlReport: function() {
      let date = `${moment().get("day")}-${moment().get(
        "month"
      )}-${moment().get("year")}`;
      //   console.log(this.dateFrom);

      //   console.log(
      //     `/measurementsAVGUser/${this.user.ID}/report/${this.dateFrom}`
      //   );

      //   return `/reportGenerator/${this.user.ID}/2019-07-15`;
      return `/measurementsAVGUser/${this.user.ID}/report/${this.dateFrom}`;
    },
    rows() {
      return this.measurements.length;
    },
    pages() {
      this.totalPages = this.rows / this.perPage;
    }
  },

  mounted() {
    this.getUserData();
    // let date = new Date();
    this.dateFrom = moment()
      .subtract(7, "days")
      .format("YYYY-MM-DD");
    this.formAdd.date_of_measurement = moment().format("YYYY-MM-DD");
  }
};
</script>

<style scoped>
td,
th {
  vertical-align: baseline;
  padding: 0.25em;
}
.confirm {
  width: 200px;
}
.tdEnd {
  text-align: end;
}
</style>
