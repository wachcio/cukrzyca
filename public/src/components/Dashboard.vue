<template>
  <div>
    <h2>Panel użytkownika {{ user.name }}</h2>

    <a :href="urlReport" target="_blanc">Generuj tygodniowy raport od dnia</a>
    <datepicker v-model="dateFrom" format="YYYY-MM-DD" lang="en" value-type="format"></datepicker>
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
      dateFrom: ""
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