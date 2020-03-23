<template>
  <main>
    <h1>All projects</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <nuxt-link :to="`/project/${project.id}`"
          >project {{ project.id }}
        </nuxt-link>
      </li>
    </ul>
    <section></section>
  </main>
</template>

<script>
export default {
  name: 'Index',
  computed: {
    projects() {
      return this.$store.state.projects.list;
    }
  }
};
</script>
