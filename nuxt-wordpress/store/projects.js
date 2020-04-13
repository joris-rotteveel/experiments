import findIndex from 'lodash.findindex';

import APIService from '@/services/APIService.js';

export const namespaced = true;

export const state = () => ({
  projects: [],
  projectTotal: 0,
  project: {}
});

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

export const nuxtServerInit = async function({ dispatch }) {
  await dispatch('core/load');
};

const addProjects = (p) => {
  p.images = [
    {
      src: 'https://picsum.photos/600/1200',
      dimensions: { width: 600, height: 1200 },
      parallax: { start: 0, end: 0 },
      color: '#ff0000'
    },
    {
      src: 'https://picsum.photos/1200/1200',
      dimensions: { width: 1200, height: 1200 },
      parallax: { start: 100, end: -100 },
      color: '#ff00ff'
    },
    {
      src: 'https://picsum.photos/900/450',
      dimensions: { width: 900, height: 450 },
      parallax: { start: 0, end: -0 },
      color: '#ffff00'
    },
    {
      src: 'https://picsum.photos/901/450',
      dimensions: { width: 901, height: 450 },
      parallax: { start: 0, end: -0 },
      color: '#ff0f0f'
    },
    {
      src: 'https://picsum.photos/901/400',
      dimensions: { width: 901, height: 400 },
      parallax: { start: 0, end: -0 },
      color: '#0f0f0f'
    }
  ];
  p.hero = {
    src: 'https://picsum.photos/999/999',
    dimensions: { width: 901, height: 400 },
    parallax: { start: 0, end: -0 },
    color: '#0f0f0f'
  };
  return p;
};

export const actions = {
  fetchProjects({ commit }) {
    return APIService.getProjects()
      .then((response) => {
        const projects = response.data.map((p) => addProjects(p));
        commit('SET_PROJECTS', projects);
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching projects: ' + error.message
        };
        // eslint-disable-next-line
        console.error(notification.message);
        // dispatch("notification/add", notification, { root: true });
      });
  },
  fetchProject({ commit, getters }, rawID) {
    const id = parseInt(rawID, 10);

    // retrieve from server
    return APIService.getProject(id)
      .then((response) => {
        const project = { ...response.data };
        addProjects(project);

        commit('SET_PROJECT', project);
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching project: ' + error.message
        };
        // eslint-disable-next-line
        console.error(notification.message);
        // dispatch("notification/add", notification, { root: true });
      });
  }
};

export const getters = {
  getProjectByID: (state) => (id) => {
    return state.projects.find((p) => p.id === parseInt(id, 10));
  },

  getNextProject: (state) => (id) => {
    const currentIndex = findIndex(state.projects, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > state.projects.length - 1) return state.projects[0];
      return state.projects[nextIndex];
    }

    return null;
  },

  getPreviousProject: (state) => (id) => {
    const currentIndex = findIndex(state.projects, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) return state.projects[state.projects.length - 1];
      return state.projects[prevIndex];
    }
    return null;
  }
};
