<template>
  <div>
    <h2>Panel użytkownika {{ user.name }}</h2>

    <a :href="urlReport" target="_blanc">Generuj tygodniowy raport od dnia</a>
    <datepicker v-model="dateFrom" format="YYYY-MM-DD" lang="en" value-type="format"></datepicker>

    <table class="table table-striped table-hover" v-if="measurements">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">ID</th>
          <th scope="col">Poziom cukru</th>
          <th scope="col">Dawka insuliny</th>
          <th scope="col">Godzina pomiaru</th>
          <th scope="col">Data pomiaru</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(measurement, index) in measurements" :key="measurement.ID">
          <th scope="row">{{index+1}}</th>
          <td>{{measurement.ID}}</td>
          <td>{{measurement.sugar_level}}</td>
          <td>{{measurement.insulin_dose}}</td>
          <td>{{measurement.hour_of_measurement}}</td>
          <td>{{measurement.date_of_measurement}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import moment from "moment";
import Datepicker from "vue2-datepicker";
export default {
  name: "Dashboard",
  data() {
    return {
      user: {
        name: ""
      },
      dateFrom: "",
      measurements: ""
    };
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
          console.log(response);
          self.$set(this, "user", response.data.user);
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
          console.log(response);
          self.$set(this, "measurements", response.data);
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