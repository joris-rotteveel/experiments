<template>
  <div>
    <h1>Projects list</h1>
    <ProjectCard
      v-for="project in project.projects"
      :key="project.id"
      :id="project.id"
      :project="project"
    />
  </div>
</template>

<script>
import ProjectCard from "@/components/ProjectCard.vue";
import { mapState } from "vuex";

export default {
  components: {
    ProjectCard
  },
  created() {
    this.$store.dispatch("project/fetchProjects");
  },
  computed: {
    ...mapState(["project"])
  }
};
</script>
