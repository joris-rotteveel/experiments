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
  methods: {
    update() {
      const currentScrollPos = window.scrollY;
      const isPastCenter = window.scrollY > window.innerHeight * 1.25;

      const l = !isPastCenter
        ? mapRange(currentScrollPos, 0, window.innerHeight * 10, 0, -100)
        : 0;
      this.$refs.imageContainer.style.transform = 'translate3d(0,'.concat(
        l,
        '%,0)'
      );

      console.log(l);
      requestAnimationFrame(this.update);
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
