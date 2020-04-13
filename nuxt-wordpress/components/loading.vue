<template lang="html">
  <div v-if="loading" ref="loader" class="loading-page">
    <p>Loading...{{ loading }}</p>
  </div>
</template>

<script>
import gsap from 'gsap';
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      gsap.to(this.$refs.loader, {
        autoAlpha: 0,

        onComplete: () => {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.loading-page {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}
</style>
