<template>
  <div>
    <div ref="container" class="top">
      <img
        v-if="activeHero"
        ref="image"
        class="top__image"
        :src="activeHero.src"
      />
    </div>
    <nuxt />
  </div>
</template>

<script>
import gsap from 'gsap';
import { mapGetters } from 'vuex';
import { getters as animationGetters } from '@/observables/ProjectsObservable';

export default {
  data() {
    return { activeHero: null };
  },
  computed: {
    ...mapGetters({ getProjectByID: 'projects/getProjectByID' }),
    projectHighlight() {
      return animationGetters.highlight();
    },
    getStyle() {
      return { background: this.activeHero.color, height: '100vh' };
    },
    currentAnimation() {
      return animationGetters.currentAnimation();
    }
  },
  watch: {
    projectHighlight(id) {
      const project = this.getProjectByID(id);
      this.activeHero = project.hero;
    },
    currentAnimation(animationConfig) {
      gsap.to(this.$refs.image, { ...animationConfig });
    }
  }
};
</script>

<style scoped>
.top {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.top__image {
  width: 100%;
  height: auto;
}
</style>
