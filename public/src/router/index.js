import Vue from "vue";
import Router from "vue-router";
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard/Main.vue";
import DashboardAddMeasurement from "../components/Dashboard/AddMeasurement.vue";
import Measurements from "../components/Dashboard/Measurements.vue";
import Report from "../components/Dashboard/Report.vue";
import Admin from "../components/Dashboard/Admin/Home.vue";
import AdminAddUser from "../components/Dashboard/Admin/AddUser.vue";
import AdminEditUser from "../components/Dashboard/Admin/EditUser.vue";

Vue.use(Router);

export default new Router({
   routes: [
      {
         path: "/",
         name: "Login",
         component: Login
      },
      {
         path: "/dashboard",
         name: "Dashboard",
         component: Dashboard,
         children: [
            {
               path: "addMeasurement",
               name: "dashboardAddMeasurement",
               component: DashboardAddMeasurement
            },
            {
               path: "measurements",
               name: "measurements",
               component: Measurements
            },
            {
               path: "report",
               name: "report",
               component: Report
            },
            {
               path: "admin",
               name: "admin",
               component: Admin,
               children: [
                  {
                     path: "addUser",
                     name: "adminAddUser",
                     component: AdminAddUser
                  },
                  {
                     path: "editUser",
                     name: "adminEditUser",
                     component: AdminEditUser
                  }
               ]
            }
         ]
      }
   ]
});
