<template>
  <div>
    <h3>Edytuj</h3>

    <table class="table table-striped table-hover" id="userTable">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">ID</th>
          <th scope="col">Imię</th>
          <th scope="col">Nazwisko</th>
          <th scope="col">Login</th>
          <th scope="col">Hasło</th>
          <th scope="col">Admin</th>
          <th scope="col">Data narodzin</th>
        </tr>
      </thead>

      <UserItems></UserItems>
    </table>
  </div>
</template>

<script>
import UserItems from "./EditUserItems.vue";
export default {
  name: "AdminEditUser",
  props: {},
  data() {
    return {};
  },
  components: { UserItems },
  methods: {},
  computed: {},
  created() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>