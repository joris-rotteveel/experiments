<template>
  <div ref="container" class="top">
    <img
      ref="image"
      class="top__image"
      v-if="activeHero"
      :src="activeHero.src"
    />
  </div>
</template>

<script>
import gsap from "gsap";
import { mapGetters } from "vuex";
import { getters as animationGetters } from "../observables/ProjectsObservable";

export default {
  name: "ProjectGlobal",
  data() {
    return { activeHero: null };
  },
  computed: {
    ...mapGetters({ getProjectByID: "projects/getProjectByID" }),
    projectHighlight() {
      return animationGetters.highlight();
    },

    currentAnimation() {
      return animationGetters.currentAnimation();
    }
  },
  watch: {
    projectHighlight(current) {
      this.activeHero = this.getProjectByID(current).hero;
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
  padding-bottom: 20vh;
}

.top__image {
  width: 100%;
  height: auto;
}
</style>
