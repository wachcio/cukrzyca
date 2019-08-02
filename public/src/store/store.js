import Vuex from "vuex";
import Vue from "vue";
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      user: {
         login: "",
         online: false,
         name: ""
      },
      measurements: ""
   },
   getters: {
      measurements: state => {
         return state.measurements;
      }
   },
   actions: {},
   mutations: {
      updateMeasurement(state, payload) {
         const index = _.findIndex(state.measurements, ["ID", payload.ID]);
         console.log("payload", payload);
         console.log("ID", payload.ID);

         console.log("index", index);

         console.log("stateIndex", state.measurements[index]);

         state.measurements[index][payload.fieldName] = payload.value;
      },
      fillMeasurements(state, payload) {
         state.measurements = payload.value;
      }
   }
});
