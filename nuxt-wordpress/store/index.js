export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({ dispatch }) {
    await dispatch('projects/fetchProjects');
  }
};
