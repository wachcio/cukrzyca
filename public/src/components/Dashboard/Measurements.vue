<template>
  <div>
    <h3>Odczyty</h3>
    <table
      class="table table-striped table-hover"
      v-if="measurements.length"
      id="measurementsTable"
    >
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

      <MeasurementsItems></MeasurementsItems>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import MeasurementsItems from "./MeasurementsItems.vue";
export default {
  name: "Measurements",
  props: {},
  data() {
    return { editID: false };
  },
  components: { Datepicker, MeasurementsItems },
  methods: {
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV",
      "logoutV"
    ])
  },
  computed: { ...mapState(["measurements", "user"]) },
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
h3 {
  font-size: 1.3em;
}
td,
th {
  vertical-align: baseline;
  padding: 0.25em;
}
.tdEnd {
  text-align: end;
}
</style>