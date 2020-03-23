<template>
  <main class="content">
    <nuxt-link to="/">Go home</nuxt-link>
    <h1>Project {{ project.id }}</h1>
    <h2>{{ getProjectByID(10).id }}</h2>
    <section>
      <IntrinsicImage
        v-for="(image, index) in project.images"
        ref="images"
        :key="index"
        :settings="image"
      ></IntrinsicImage>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import IntrinsicImage from '~/components/IntrinsicImage.vue';
import { mapRange } from '~/utils/math';

export default {
  components: {
    IntrinsicImage
  },
  computed: {
    ...mapGetters({ getProjectByID: 'projects/getProjectByID' }),
    project() {
      return this.$store.getters['projects/getProjectByID'](
        this.$route.params.id
      );
    }
  },
  mounted() {
    this.parallaxItems = this.$refs.images.map(function(component) {
      const rect = component.$el.getBoundingClientRect();
      const start = Number(component.$el.getAttribute('parallax-start'));
      const end = Number(component.$el.getAttribute('parallax-end'));
      return {
        el: component.$el,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        start,
        end
      };
    });
    this.update();
  },
  methods: {
    update() {
      if (this.parallaxItems.length) {
        const currentScrollPos = window.scrollY;
        for (let i = 0; i < this.parallaxItems.length; i++) {
          const item = this.parallaxItems[i];
          const { bottom, start, top, end, el } = item;
          const visiblePosMin = top - window.innerHeight;
          const visiblePosMax = bottom;
          if (
            currentScrollPos > visiblePosMin &&
            currentScrollPos < visiblePosMax
          ) {
            const l = mapRange(
              currentScrollPos,
              visiblePosMin,
              visiblePosMax,
              start,
              end
            );
            el.style.transform = 'translate3d(0,'.concat(l, '%,0)');
          }
        }
      }
      requestAnimationFrame(this.update);
    }
  }
};
</script>

<style scoped>
.content {
  position: relative;
  margin-top: 50vh;
  margin-bottom: 50vh;
  width: 100%;
  background: white;
  z-index: 2;
}
.image {
  width: 25vw;
}
</style>
