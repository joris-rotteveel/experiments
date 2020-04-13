<template>
  <div
    class="image"
    parallax
    :parallax-start="`${settings.parallax.start}`"
    :parallax-end="`${settings.parallax.end}`"
  >
    <div class="intrinsic" :style="setAspectRatio">
      <img :src="`${settings.src}`" class="intrinsic__image" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["settings"],
  computed: {
    setAspectRatio() {
      const { dimensions } = this.settings;
      const { width, height } = dimensions;
      return {
        // set the padding-top the the aspect ratio %. this will ensure that the image is always in the correct aspect ratio
        paddingTop: (height / width) * 100 + "%"
      };
    }
  }
};
</script>

<style scoped>
.intrinsic {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.intrinsic__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
