<template>
  <main>
    <h1>All projects - VUE</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <router-link :to="`/project/${project.id}`"
          >project {{ project.id }}
        </router-link>
      </li>
    </ul>
    <section></section>
  </main>
</template>

<script>
export default {
  name: "Index",
  computed: {
    projects() {
      return this.$store.state.projects.list;
    }
  }
};
</script>
