<template>
  <div class="report__container">
    <p>Raport od dnia</p>
    <Datepicker v-model="dateFrom" format="YYYY-MM-DD" :lang="lang" value-type="format"></Datepicker>
    <a :href="urlReport" target="_blanc" class="btn btn-primary">Generuj</a>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Report",
  props: {},
  data() {
    return { dateFrom: "" };
  },
  components: { Datepicker },
  methods: {
    // ...mapActions(),
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV",
      "logoutV"
    ])
  },
  computed: {
    ...mapState(["measurements", "user", "lang"]),
    // ...mapGetters(),

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
  created() {
    this.dateFrom = moment()
      .subtract(6, "days")
      .format("YYYY-MM-DD");
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>