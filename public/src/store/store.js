import Vuex from "vuex";
import Vue from "vue";
import _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      user: {
         online: false
      },
      measurements: "",
      lang: {
         days: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
         months: [
            "Sty",
            "Lut",
            "Mar",
            "Kwi",
            "Maj",
            "Cze",
            "Lip",
            "Sie",
            "Wrz",
            "Paź",
            "Lis",
            "Gru"
         ],
         pickers: [
            "następne 7 dni",
            "następne 30 dni",
            "wcześniejsze 7 dni",
            "wcześniejsze 7 dni"
         ],
         placeholder: {
            date: "Wybierz datę",
            dateRange: "Wybierz przedział dat"
         }
      }
   },
   getters: {
      measurements: state => {
         return state.measurements;
      }
   },
   actions: {},
   mutations: {
      updateMeasurementV(state, payload) {
         const index = _.findIndex(state.measurements, ["ID", payload.ID]);
         console.log("payload", payload);
         console.log("ID", payload.ID);

         console.log("index", index);

         console.log("stateIndex", state.measurements[index]);

         state.measurements[index][payload.fieldName] = payload.value;
      },
      fillMeasurementsV(state, payload) {
         state.measurements = payload.value;
      },
      fillUserDataV(state, payload) {
         console.log("payload", payload);

         state.user = payload;
         state.user.online = true;
         delete state.user.password;
      },
      logoutV(state, payload) {
         //  console.log("logout");

         state.user.ID = null;
         state.user.date_added = null;
         state.user.date_of_birth_child = null;
         state.user.first_name = null;
         state.user.is_admin = null;
         state.user.last_name = null;
         state.user.login = null;
         state.user.name = null;
         state.user.online = false;
      }
   }
});
