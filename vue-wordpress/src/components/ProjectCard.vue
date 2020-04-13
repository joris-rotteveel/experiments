<template>
  <div class="card">
    <router-link
      class="event-link"
      :to="{ name: 'Project', params: { id: project.id } }"
      >{{ project.post_title }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: { project: Object },
};
</script>

<style scoped>
.card {
  border: 1px solid black;
  width: 25%;
  margin-bottom: 30px;
  background: lightgray;
  min-height: 150px;
}
</style>
