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
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "DashboardNav",
  props: {},
  data() {
    return {};
  },
  components: {},
  methods: {},
  computed: {},
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>