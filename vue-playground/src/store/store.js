import Vue from "vue";
import Vuex from "vuex";

import * as projects from "./modules/projects";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    projects
  }
});
