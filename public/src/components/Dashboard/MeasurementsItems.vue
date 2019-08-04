<template >
  <tbody>
    <tr
      v-for="(measurement, index) in measurements"
      :key="measurement.ID"
      @dblclick="editMeasurement(measurement)"
    >
      <th scope="row" @dblclick="editMeasurement(measurement)">{{index+1}}</th>
      <!-- <td>{{measurement.ID}}</td> -->
      <td>
        <input
          v-if="editID == measurement.ID"
          :value="measurement.sugar_level"
          @change="updateMeasurement($event, 'sugar_level', measurement.ID)"
          type="number"
        />
        <span v-if="editID != measurement.ID">{{measurement.sugar_level}}</span>
      </td>
      <td>
        <input
          v-if="editID == measurement.ID"
          :value="measurement.insulin_dose"
          @change="updateMeasurement($event, 'insulin_dose', measurement.ID)"
          type="number"
        />
        <span v-if="editID != measurement.ID">{{measurement.insulin_dose}}</span>
      </td>
      <td>
        <input
          v-if="editID == measurement.ID"
          :value="measurement.hour_of_measurement"
          @change="updateMeasurement($event, 'hour_of_measurement', measurement.ID)"
          type="number"
        />
        <span v-if="editID != measurement.ID">{{measurement.hour_of_measurement}}</span>
      </td>
      <td>
        <!-- <input
                v-if="editID == measurement.ID"
                :value="measurement.date_of_measurement"
                @change="updateMeasurement($event, 'date_of_measurement', measurement.ID)"
                type="text"
        />-->
        <Datepicker
          v-if="editID == measurement.ID"
          :value="measurement.date_of_measurement"
          format="YYYY-MM-DD"
          lang="en"
          value-type="format"
          @change="updateMeasurement($event, 'date_of_measurement', measurement.ID)"
        ></Datepicker>
        <span v-if="editID != measurement.ID">{{measurement.date_of_measurement}}</span>
      </td>
      <td class="tdEnd">
        <div v-show="editID !=measurement.ID && editID !=null" class="btn">
          &nbsp;
          <!-- <font-awesome-icon icon size="lg" /> -->
        </div>
        <div v-show="!editID" class="btn btn-primary" @click="editMeasurement(measurement)">
          <font-awesome-icon icon="pen" size="lg" @click="editMeasurement(measurement)" />
        </div>
        <div v-show="!editID" class="btn btn-danger" @click="deleteMeasurement(measurement)">
          <font-awesome-icon icon="trash-alt" size="lg" @click="deleteMeasurement(measurement)" />
        </div>

        <div
          v-show="editID == measurement.ID"
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
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "MeasurementsItems",
  props: {},
  data() {
    return { editID: false };
  },
  components: { Datepicker },
  methods: {
    ...mapMutations([
      "updateMeasurementV",
      "fillMeasurementsV",
      "fillUserDataV",
      "logoutV"
    ]),
    updateMeasurement(e, fieldName, ID) {
      // updateMeasurement($event, "date_of_measurement", measurement.ID);
      // console.log(fieldName, e);

      if (fieldName == "date_of_measurement") {
        this.updateMeasurementV({
          value: e,
          fieldName,
          ID
        });
      } else {
        this.updateMeasurementV({
          value: e.target.value,
          fieldName,
          ID
        });
      }
    },
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
          // console.log(response.data);
          //   self.$set(this, "measurements", response.data);
          if (response.data.error) {
            self.fillMeasurements({});
          } else self.fillMeasurements(response.data);
        })
        // .then(response => {
        //   this.pages;
        // })
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
      this.editID = m.ID;
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
    // td: function(m, mField, inputType) {
    //   // editID == measurement.ID ? "edycja" : {{measurement.sugar_level}}
    //   // this.edit[mField] = m[mField];

    //   return this.editID == m.ID
    //     ? `<input type="${inputType}" v-model="${m[mField]}"/>`
    //     : `${m[mField]}`;
    // },
    // VModelTd: function(m, mField) {
    //   return this.editID == m.ID ? this.edit[mField] : m[mField];
    // },
    saveEditMeasurement: function(m) {
      axios
        .patch("/measurementUpdate/", {
          ID: m.ID,
          sugar_level: m.sugar_level,
          insulin_dose: m.insulin_dose,
          date_of_measurement: m.date_of_measurement,
          hour_of_measurement: m.hour_of_measurement
        })
        .then(response => {
          this.getAllMeasurements();
          console.log(response);
        })
        .then(response => {
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