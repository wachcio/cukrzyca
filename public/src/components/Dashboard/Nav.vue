<template>
  <div>
    <div class="btn-group" role="group">
      <router-link
        class="btn btn-secondary"
        :to="{name:'DashboardAddMeasurement'}"
        exact
      >Dodaj odczyt</router-link>
      <router-link class="btn btn-secondary" :to="{name:'Measurements'}" exact>Odczyty</router-link>
      <router-link class="btn btn-secondary" :to="{name:'Report'}" exact>Raport</router-link>
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