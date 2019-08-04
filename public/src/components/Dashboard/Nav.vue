<template>
  <div class="btn-group" role="group">
    <button class="btn btn-secondary" @click="currentPage = 1">Dodaj odczyt</button>
    <button class="btn btn-secondary" @click="currentPage = 2">Odczyty</button>
    <button class="btn btn-secondary" @click="currentPage = 3">Raport</button>
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