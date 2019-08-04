<template>
  <div>
    <h3>Panel administarcyjny</h3>
    <div class="btn-group" role="group">
      <router-link class="btn btn-primary" :to="{name:'adminAddUser'}">Dodaj użytkownika</router-link>
      <router-link class="btn btn-primary" :to="{name:'adminEditUser'}">Edytuj użytkownika</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Admin",
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