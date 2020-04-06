<template>
  <div>
    <div class="title">
      {{ message }}
    </div>
    <p v-if="statusCode === 404">
      <nuxt-link to="/">
        Return to homepage
      </nuxt-link>
    </p>
  </div>
</template>
<script>
export default {
  name: 'NuxtError',
  props: {
    error: {
      // <--- Send in the error
      type: Object,
      default: null
    }
  },
  computed: {
    statusCode() {
      // <--- Get the status code
      return (this.error && this.error.statusCode) || 500;
    },
    message() {
      // <--- Print the error
      return this.error.message;
    }
  },
  head() {
    return {
      title: this.message // <--- Set the SEO title
    };
  }
};
</script>
