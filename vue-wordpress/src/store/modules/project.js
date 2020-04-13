import findIndex from "lodash.findindex";

import APIService from "@/services/APIService.js";

export const namespaced = true;

export const state = {
  projects: [],
  projectTotal: 0,
  project: {}
};

export const mutations = {
  SET_PROJECTS(state, projects) {
    const parsedProjects = [...projects].map(({ ID, ...rest }) => {
      return { ...rest, id: ID };
    });

    state.projects = parsedProjects;
  },

  SET_PROJECT(state, project) {
    state.project = { ...project, id: project.ID };
  }
};

export const actions = {
  fetchProjects({ commit }) {
    APIService.getProjects()
      .then(response => {
        commit("SET_PROJECTS", response.data);
      })
      .catch(error => {
        const notification = {
          type: "error",
          message: "There was a problem fetching projects: " + error.message
        };
        console.error(notification.message);
        // dispatch("notification/add", notification, { root: true });
      });
  },
  fetchProject({ commit, getters }, rawID) {
    //check cache
    const id = parseInt(rawID, 10);
    var project = getters.getProjectByID(id);
    if (project) {
      commit("SET_PROJECT", project);
    } else {
      //retrieve from server
      APIService.getProject(id)
        .then(response => {
          commit("SET_PROJECT", response.data);
        })
        .catch(error => {
          const notification = {
            type: "error",
            message: "There was a problem fetching project: " + error.message
          };
          console.error(notification.message);
          // dispatch("notification/add", notification, { root: true });
        });
    }
  }
};

export const getters = {
  getProjectByID: state => id => {
    return state.projects.find(p => p.id === parseInt(id, 10));
  },

  getNextProject: state => id => {
    const currentIndex = findIndex(state.projects, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > state.projects.length - 1) return state.projects[0];
      return state.projects[nextIndex];
    }
    return null;
  },

  getPreviousProject: state => id => {
    const currentIndex = findIndex(state.projects, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) return state.projects[state.projects.length - 1];
      return state.projects[prevIndex];
    }
    return null;
  }
};
