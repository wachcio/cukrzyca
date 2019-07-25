<template>
  <div>
    <h2>Panel użytkownika</h2>
    <p>Name: {{ user.name }}</p>

    <a :href="urlReport">{{urlReport}}</a>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
export default {
  name: "Dashboard",
  data() {
    return {
      user: {
        name: ""
      }
    };
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
    }
  },
  computed: {
    urlReport: function() {
      console.log(this.user);

      //   return `/reportGenerator/${this.user.ID}/2019-07-15`;
      return `/measurementsAVGUser/${this.user.ID}/report/2019-07-14`;
    }
  },

  mounted() {
    this.getUserData();
  }
};
</script>