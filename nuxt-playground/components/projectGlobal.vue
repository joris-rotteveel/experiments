<template>
  <div ref="container" class="top">
    <nuxt-link v-if="prevProject" :to="`/project/${prevProject.id}`"
      >previous Project {{ prevProject.id }}
    </nuxt-link>
    <nuxt-link v-if="nextProject" :to="`/project/${nextProject.id}`"
      >Next Project {{ nextProject.id }}
    </nuxt-link>
  </div>
</template>

<script>
import gsap from 'gsap';

export default {
  name: 'ProjectGlobal',
  computed: {
    nextProject() {
      return this.$store.getters['projects/getNextProject'](
        parseInt(this.$route.params.id)
      );
    },
    prevProject() {
      return this.$store.getters['projects/getPreviousProject'](
        parseInt(this.$route.params.id)
      );
    }
  },
  beforeRouteUpdate(to, from, next) {
    gsap.to(this.$refs.container, {
      backgroundColor: this.nextProject
        ? this.nextProject.color
        : this.prevProject.color,
      onComplete: () => {
        next();
      }
    });
  }
};
</script>

<style scoped>
.top {
  position: fixed;
  top: 0;
  display: flex;
  align-content: flex-end;
  text-align: center;
  background-color: grey;
  width: 100%;
  height: 100vh;
  z-index: 1;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20vh;
}
</style>
