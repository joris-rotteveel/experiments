<template>
  <div>
    <router-view :key="$route" />
  </div>
</template>

<script>
export default {
  name: "Index",
  computed: {}
};
</script>
<style>
html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  line-height: 1.5;
}
</style>
