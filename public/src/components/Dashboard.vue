<template>
  <div>
    <h3>Panel użytkownika {{ user.name }}</h3>
    <div class="btn-group" role="group">
      <button class="btn btn-secondary" @click="currentPage = 1">Dodaj odczyt</button>
      <button class="btn btn-secondary" @click="currentPage = 2">Odczyty</button>
      <button class="btn btn-secondary" @click="currentPage = 3">Raport</button>
    </div>
    <div class="containerForm" v-show="currentPage == 1">
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
        <datepicker
          v-model="formAdd.date_of_measurement"
          format="YYYY-MM-DD"
          lang="en"
          value-type="format"
        ></datepicker>
        <button
          class="btn btn-primary btn__saveMeasurement"
          :disabled="$v.$invalid"
          @click="saveMeasurement()"
        >Zapisz odczyt</button>
      </form>
      <!-- <pre>{{$v}}</pre> -->
    </div>

    <div v-show="currentPage == 2">
      <h3>Odczyty</h3>
      <table class="table table-striped table-hover" v-if="measurements" id="measurementsTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
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
            <td>{{measurement.ID}}</td>
            <td>
              <input
                v-if="edit.ID == measurement.ID"
                v-model="measurement.sugar_level"
                type="number"
              />
              <span v-if="edit.ID != measurement.ID">{{measurement.sugar_level}}</span>
            </td>
            <td>
              <input
                v-if="edit.ID == measurement.ID"
                v-model="measurement.insulin_dose"
                type="number"
              />
              <span v-if="edit.ID != measurement.ID">{{measurement.insulin_dose}}</span>
            </td>
            <td>
              <input
                v-if="edit.ID == measurement.ID"
                v-model="measurement.hour_of_measurement"
                type="number"
              />
              <span v-if="edit.ID != measurement.ID">{{measurement.hour_of_measurement}}</span>
            </td>
            <td>
              <input
                v-if="edit.ID == measurement.ID"
                v-model="measurement.date_of_measurement"
                type="text"
              />
              <span v-if="edit.ID != measurement.ID">{{measurement.date_of_measurement}}</span>
            </td>
            <td class="tdEnd">
              <div v-show="edit.ID !=measurement.ID && edit.ID !=null" class="btn">
                &nbsp;
                <font-awesome-icon icon size="lg" />
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
                @click="saveEditMeasurement(measurement)"
              >
                <font-awesome-icon icon="check" size="lg" />
              </div>
              <div v-show="false" class="btn btn-danger" @click="cleanEditObject()">
                <font-awesome-icon icon="times" size="lg" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="currentPage == 3" class="report__container">
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
      currentPage: 1,
      edit: {
        ID: ""
        // sugar_level: "",
        // insulin_dose: "",
        // hour_of_measurement: "",
        // date_of_measurement: ""
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
    cleanEditObject: function() {
      // let self = this;
      // console.log("clean", this.edit);

      this.edit.ID = null;
      // this.edit.ID_user = null;
      // this.edit.date_of_measurement = null;
      // this.edit.date_added = null;
      // this.edit.hour_of_measurement = null;
      // this.edit.insulin_dose = null;
      // this.edit.sugar_level = null;

      // this.edit.sugar_level = 33;
    },
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
      // this.edit = m;
      // Object.assign(this.edit, m);
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
      // this.edit[mField] = m[mField];

      return this.edit.ID == m.ID
        ? `<input type="${inputType}" v-model="${m[mField]}"/>`
        : `${m[mField]}`;
    },
    VModelTd: function(m, mField) {
      return this.edit.ID == m.ID ? this.edit[mField] : m[mField];
    },
    saveEditMeasurement: function(m) {
      axios
        .patch("/measurementUpdate/", {
          ID: m.ID,
          sugar_level: m.sugar_level,
          insulin_dose: m.insulin_dose,
          date_of_measurement: m.date_of_measurement,
          hour_of_measurement: m.hour_of_measurement
          // ID: this.edit.ID,
          // sugar_level: this.edit.sugar_level,
          // insulin_dose: this.edit.insulin_dose,
          // date_of_measurement: this.edit.date_of_measurement,
          // hour_of_measurement: this.edit.hour_of_measurement
        })
        .then(response => {
          this.getAllMeasurements();
          console.log(response);
        })
        .then(response => {
          // for (var member in this.edit) delete this.edit[member];
          this.cleanEditObject();
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
      .subtract(6, "days")
      .format("YYYY-MM-DD");
    this.formAdd.date_of_measurement = moment().format("YYYY-MM-DD");
  }
};
</script>

<style scoped>
h3 {
  font-size: 1.3em;
}
td,
th {
  vertical-align: baseline;
  padding: 0.25em;
}
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
.mx-datepicker {
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
