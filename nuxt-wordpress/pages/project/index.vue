<template>
  <div>
    <nuxt-link to="/">back</nuxt-link>
    <h1>Project list</h1>

    <ProjectCard
      v-for="project in projects"
      :id="project.id"
      :key="project.id"
      :project="project"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProjectCard from '@/components/ProjectCard.vue';

export default {
  components: {
    ProjectCard
  },
  // async fetch({ store, error }) {
  //   try {
  //     await store.dispatch('projects/fetchProjects');
  //   } catch (e) {}
  // },
  computed: mapState({
    projects: (state) => {
      return state.projects.projects;
    }
  }),

  head() {
    return {
      title: 'Projects',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'A list of projects'
        }
      ]
    };
  }
};
</script>

<style></style>
