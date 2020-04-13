import Vue from 'vue';

const state = Vue.observable({
  currentAnimation: {},
  highlight: null
});

export const getters = {
  currentAnimation: () => state.currentAnimation,
  highlight: () => state.highlight
};

export const mutations = {
  setCurrentAnimation: (val) => (state.currentAnimation = val),
  setHighlight: (val) => (state.highlight = val)
};

export const actions = {
  setAnimation(animationConfig) {
    mutations.setCurrentAnimation(animationConfig);
  },
  setHighlight(id) {
    mutations.setHighlight(id);
  }
};
