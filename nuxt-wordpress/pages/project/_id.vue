<template>
  <div class="project">
    <main ref="container" class="content">
      <router-link to="/">Go home</router-link>
      <h2>{{ project.id }}</h2>
      <section>
        <IntrinsicImage
          v-for="(image, index) in project.images"
          ref="images"
          :key="index"
          :settings="image"
        ></IntrinsicImage>
      </section>
    </main>

    <div ref="link" class="next">
      <!-- <router-link class="next__link" :to="`/project/${nextProject.id}`">
        Next
      </router-link> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IntrinsicImage from '@/components/IntrinsicImage.vue';

export default {
  components: {
    IntrinsicImage
  },
  async fetch({ store, error, params }) {
    try {
      await store.dispatch('projects/fetchProject', params.id);
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch project #' + params.id
      });
    }
  },
  computed: mapState({
    project: (state) => state.projects.project
  }),
  head() {
    return {
      title: 'Project #' + this.project.id,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'What you need to know about Project #' + this.project.id
        }
      ]
    };
  }
};
</script>

<style></style>
