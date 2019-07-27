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
          placeholder="poziom cukru"
          v-model="formAdd.sugar_level"
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
          placeholder="godzina odczytu"
          v-model="formAdd.hour_of_measurement"
        />
        <datepicker
          v-model="formAdd.date_of_measurement"
          format="YYYY-MM-DD"
          lang="en"
          value-type="format"
        ></datepicker>
        <button class="btn btn-primary" @click="saveMeasurement()">Zapisz odczyt</button>
      </div>
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(measurement, index) in measurements" :key="measurement.ID">
            <th scope="row">{{index+1}}</th>
            <!-- <td>{{measurement.ID}}</td> -->
            <td>{{measurement.sugar_level}}</td>
            <td>{{measurement.insulin_dose}}</td>
            <td>{{measurement.hour_of_measurement}}</td>
            <td>{{measurement.date_of_measurement}}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="0">
        <p>Strona: {{ currentPage }}</p>
        <v-pagination
          v-model="currentPage"
          :page-count="totalPages"
          :classes="bootstrapPaginationClasses"
          :labels="paginationAnchorTexts"
        ></v-pagination>
      </div>
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
import vPagination from "vue-plain-pagination";
export default {
  name: "Dashboard",
  data() {
    return {
      user: {
        name: ""
      },
      dateFrom: "",
      measurements: "",
      perPage: 3,
      currentPage: 1,
      pageCount: 10,
      totalPages: 0,
      bootstrapPaginationClasses: {
        ul: "pagination",
        li: "page-item",
        liActive: "active",
        liDisable: "disabled",
        button: "page-link"
      },
      paginationAnchorTexts: {
        first: "Pierwsza",
        prev: "Poprzednia",
        next: "Następna",
        last: "Ostatnia"
      },
      formAdd: {
        sugar_level: "",
        insulin_dose: "",
        hour_of_measurement: "",
        date_of_measurement: ""
      }
    };
  },
  components: {
    Datepicker,
    vPagination
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
  }
};
</script>