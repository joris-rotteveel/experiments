<template>
  <div>
    <div ref="container" class="top">
      <div ref="imageContainer">
        <img
          v-if="activeHero"
          ref="image"
          class="top__image"
          :src="activeHero.src"
        />
      </div>
    </div>
    <nuxt />
  </div>
</template>

<script>
import gsap from 'gsap';
import { mapGetters } from 'vuex';
import { mapRange } from '@/utils/math';
import { getters as animationGetters } from '@/observables/ProjectsObservable';

export default {
  name: 'ProjectsLayout',
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
  },
  mounted() {
    this.update();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.rafID);
  },
  methods: {
    update() {
      const currentScrollPos = window.scrollY;
      const isPastCenter = window.scrollY > window.innerHeight * 1.25;

      const offsetY = !isPastCenter
        ? mapRange(currentScrollPos, 0, window.innerHeight, 0, -5)
        : 0;

      if (this.$refs.imageContainer) {
        this.$refs.imageContainer.style.transform = 'translate3d(0,'.concat(
          offsetY,
          '%,0)'
        );
      }

      this.rafID = requestAnimationFrame(this.update);
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
