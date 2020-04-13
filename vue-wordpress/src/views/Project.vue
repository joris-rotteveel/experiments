<template>
  <div class="project">
    <h1 class="title">{{ project.post_title }}</h1>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  components: {},
  props: ["id"],
  created() {
    this.fetchProject(this.id);
  },
  computed: mapState({
    project: state => state.project.project
  }),
  methods: mapActions("project", ["fetchProject"])
};
</script>
