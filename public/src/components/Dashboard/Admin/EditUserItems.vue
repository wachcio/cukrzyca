<template>
  <tbody>
    <!-- <tr v-for="(user, index) in dbUsers" :key="user.ID" @dblclick="editUser(user)"> -->
    <tr v-for="(user, index) in dbUsers" :key="user.ID">
      <!-- <th scope="row" @dblclick.stop="editUser(user)">{{index+1}}</th> -->
      <th scope="row">{{index+1}}</th>
      <td>{{user.ID}}</td>
      <td>
        <input
          v-if="editID == user.ID"
          :value="userEdit.first_name"
          @change="updateUser($event, 'first_name', user.ID)"
          type="text"
        />
        <span v-if="editID != user.ID">{{user.first_name}}</span>
      </td>
      <td>
        <input
          v-if="editID == user.ID"
          :value="userEdit.last_name"
          @change="updateUser($event, 'last_name', user.ID)"
          type="text"
        />
        <span v-if="editID != user.ID">{{user.last_name}}</span>
      </td>
      <td>
        <input
          v-if="editID == user.ID"
          :value="userEdit.login"
          @change="updateUser($event, 'login', user.ID)"
          type="text"
        />
        <span v-if="editID != user.ID">{{user.login}}</span>
      </td>
      <td>
        <input
          v-if="editID == user.ID"
          value
          @change="updateUser($event, 'password', user.ID)"
          type="password"
        />
        <span v-if="editID != user.ID">{{ }}</span>
      </td>
      <td>
        <input
          v-if="editID == user.ID"
          :checked="userEdit.is_admin"
          @change="updateUser($event, 'is_admin', user.ID)"
          type="checkbox"
          :disabled="editID != user.ID"
        />
        <input v-if=" editID != user.ID" type="checkbox" :disabled="true" :checked="user.is_admin" />
        <!-- <span v-if="editID != user.ID">{{user.is_admin}}</span> -->
      </td>
      <td>
        <Datepicker
          v-if="editID == user.ID"
          :value="userEdit.date_of_birth_child"
          format="YYYY-MM-DD"
          :lang="dateTimePicerOptions.lang"
          value-type="format"
          @change="updateUser($event, 'date_of_birth_child', user.ID)"
        ></Datepicker>
        <span v-if="editID != user.ID">{{user.date_of_birth_child}}</span>
      </td>
      <td class="tdEnd">
        <div v-show="editID !=user.ID && editID !=null" class="btn">
          &nbsp;
          <!-- <font-awesome-icon icon size="lg" /> -->
        </div>
        <div v-show="!editID" class="btn btn-primary" @click="editUser(user)">
          <font-awesome-icon icon="pen" size="lg" />
        </div>
        <div v-show="!editID" class="btn btn-danger" @click="deleteUser(user)">
          <font-awesome-icon icon="trash-alt" size="lg" />
        </div>

        <div v-show="editID == user.ID" class="btn btn-success" @click.prevent="saveEditUser(user)">
          <font-awesome-icon icon="check" size="lg" />
        </div>
        <!-- <div v-show="false" class="btn btn-danger" @click="cleanEditObject()">
          <font-awesome-icon icon="times" size="lg" />
        </div>-->
      </td>
    </tr>
  </tbody>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Datepicker from "vue2-datepicker";
import _ from "lodash";
import sha256 from "sha256";
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "AdminEditUserItems",
  props: {},
  data() {
    return {
      editID: false,
      dbUsers: [],
      userEdit: {
        ID: null,
        first_name: null,
        last_name: null,
        name: null,
        login: null,
        is_admin: null,
        date_of_birth_child: null,
        date_added: null,
        password: null
      }
    };
  },
  components: { Datepicker },
  methods: {
    ...mapMutations(["updateUserV", "fillUsersV", "fillUserDataV", "logoutV"]),
    updateUser(e, fieldName, ID) {
      // updateUser($event, "date_of_User", User.ID);
      // console.log(fielNam);

      console.log("e", e);

      if (fieldName == "password")
        this.userEdit[fieldName] = sha256(e.target.value);
      else if (fieldName == "date_of_birth_child") this.userEdit[fieldName] = e;
      else if (fieldName == "is_admin") {
        if (e.target.checked == true) this.userEdit[fieldName] = 1;
        if (e.target.checked == false) this.userEdit[fieldName] = 0;
      } else this.userEdit[fieldName] = e.target.value;
    },
    fillUsers(value) {
      // this.fillUsersV({
      //   value
      // });
    },
    cleanEditObject: function() {
      // let self = this;
      // console.log("clean", this.edit);

      this.editID = null;
      // this.editID_user = null;
      // this.edit.date_of_User = null;
      // this.edit.date_added = null;
      // this.edit.hour_of_User = null;
      // this.edit.insulin_dose = null;
      // this.edit.sugar_level = null;

      // this.edit.sugar_level = 33;
    },
    getAllUsers: function() {
      let self = this;
      axios
        .get("/users/")
        .then(response => {
          // console.log(response.data);
          //   self.$set(this, "Users", response.data);
          if (response.data.error) {
            self.dbUsers = {};
          } else self.dbUsers = response.data;
        })
        .catch(errors => {
          console.log(errors);
          router.push({ name: "adminEditUser" });
        });
    },
    deleteUser: function(m) {
      let self = this;
      if (
        confirm(
          "Czy jesteś pewien, że chcesz usunąć użytkownika " + m.login + "?"
        )
      ) {
        axios
          .delete(`/user/${m.ID}`)

          .then(response => {
            // console.log(response.data);
            //   self.$set(this, "Users", response.data);
            // if (response.data.error) {
            //   self.dbUsers = {};
            // } else self.dbUsers = response.data;
            this.getAllUsers();
          })
          .catch(errors => {
            console.log(errors);
            router.push({ name: "adminEditUser" });
          });
      }
    },

    customFormat: function(date) {
      return moment(date).format("YYYY-MM-DD");
      //   return "DD-MM-YYYY";
    },
    editUser: function(m) {
      // this.edit = m;
      // Object.assign(this.edit, m);
      // console.log("edit user", m);

      this.editID = m.ID;
      this.userEdit = _.clone(m);
      // console.log("edit user data", this.userEdit);

      // this.editUser.ID = m.ID;
      // this.editUser.first_name = m.first_name;
      // this.editUser.last_name = m.last_name;
      // this.editUser.login = m.login;
      // this.editUser.password = m.password;
      // this.editUser.is_admin = m.is_admin;
      // this.editUser.date_of_birth_child = m.date_of_birth_child;
    },

    saveEditUser: function(m) {
      axios
        .patch("/user/" + m.ID, this.userEdit)
        // .patch("/userUpdate/", {
        //   ID: m.ID,
        //   sugar_level: m.sugar_level,
        //   insulin_dose: m.insulin_dose,
        //   date_of_User: m.date_of_User,
        //   hour_of_User: m.hour_of_User
        // })
        .then(response => {
          this.getAllUsers();
          console.log(response);
        })
        .then(response => {
          this.cleanEditObject();
        })
        .catch(errors => {
          console.log(errors);
          router.push("/");
        });
    }
  },
  computed: { ...mapState(["measurements", "user", "dateTimePicerOptions"]) },
  created() {
    this.getAllUsers();
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>