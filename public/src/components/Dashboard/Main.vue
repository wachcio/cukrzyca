<template>
  <div>
    <Nav></Nav>
    <AddMeasurement></AddMeasurement>
    <Measurements></Measurements>
    <Report></Report>
  </div>
</template>

<script>
import axios from "axios";
import router from "../../router/index";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import Nav from "./Nav.vue";
import Measurements from "./Measurements.vue";
import Report from "./Report.vue";
import AddMeasurement from "./AddMeasurement.vue";
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {};
  },
  components: {
    Nav,
    AddMeasurement,
    Measurements,
    Report,
    Datepicker
  },
  methods: {
    // ...mapActions(),
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV",
      "logoutV"
    ]),
    fillMeasurements(value) {
      this.fillMeasurementsV({
        value
      });
    },
    cleanEditObject: function() {
      // let self = this;
      // console.log("clean", this.edit);

      this.editID = null;
      // this.editID_user = null;
      // this.edit.date_of_measurement = null;
      // this.edit.date_added = null;
      // this.edit.hour_of_measurement = null;
      // this.edit.insulin_dose = null;
      // this.edit.sugar_level = null;

      // this.edit.sugar_level = 33;
    },
    getAllMeasurements: function() {
      let self = this;
      axios
        .get("/measurementsUser/" + this.user.ID)
        .then(response => {
          //   console.log(response);
          // self.$set(this, "measurements", response.data);
          self.fillMeasurements(response.data);
        })
        .then(response => {
          this.pages;
        })
        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    },
    getUserData: function() {
      let self = this;
      axios
        .get("/user")
        .then(response => {
          // console.log("response.data.user", response.data.user);
          self.fillUserDataV(response.data.user);
        })
        .then(response => {
          self.getAllMeasurements();
        })
        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    }
  },
  computed: {
    ...mapState(["measurements", "user"]),
    // ...mapGetters(),

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
  }
};
</script>

<style scoped>
</style>
<style>
.mx-calendar-icon {
  height: 24px !important;
}
</style>

