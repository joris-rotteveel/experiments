<template>
  <div class="card">
    <nuxt-link
      class="event-link"
      :to="{ name: 'project-id', params: { id: project.id } }"
      >{{ project.post_title }} - {{ project.id }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-default-prop
  props: { project: Object }
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
