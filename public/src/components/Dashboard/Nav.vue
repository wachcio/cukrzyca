<template>
  <div>
    <div class="btn-group" role="group">
      <router-link
        class="btn btn-secondary"
        :to="{name:'dashboardAddMeasurement'}"
        exact
      >Dodaj odczyt</router-link>
      <router-link class="btn btn-secondary" :to="{name:'measurements'}" exact>Odczyty</router-link>
      <router-link class="btn btn-secondary" :to="{name:'report'}" exact>Raport</router-link>
      <router-link class="btn btn-secondary" :to="{name:'admin'}" exact v-if="user.is_admin">Admin</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { required, minLength, between } from "vuelidate/lib/validators";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "DashboardNav",
  props: {},
  data() {
    return {};
  },
  components: {},
  methods: {},
  computed: { ...mapState(["measurements", "user", "lang"]) },
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>