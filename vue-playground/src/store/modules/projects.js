import findIndex from "lodash.findindex";

export const namespaced = true;

export const state = {
  currentProject: null,
  list: [
    {
      id: 10,
      name: "My",
      color: "#ff0000",
      hero: {
        src: "./images/10-1200x900.jpg",
        dimensions: { width: 1200, height: 900 }
      },

      images: [
        {
          src: "https://picsum.photos/600/1200",
          dimensions: { width: 600, height: 1200 },
          parallax: { start: 0, end: 0 }
        },
        {
          src: "https://picsum.photos/1200/1200",
          dimensions: { width: 1200, height: 1200 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: "https://picsum.photos/900/450",
          dimensions: { width: 900, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: "https://picsum.photos/901/450",
          dimensions: { width: 901, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: "https://picsum.photos/901/400",
          dimensions: { width: 901, height: 400 },
          parallax: { start: 0, end: -0 }
        }
      ]
    },
    {
      id: 1,
      color: "#00ff00",
      name: "Milkshake",
      hero: {
        src: "./images/20-1200x900.jpg",
        dimensions: { width: 1200, height: 900 }
      },

      images: [
        {
          src: "https://picsum.photos/450/1210",
          dimensions: { width: 450, height: 1210 },
          parallax: { start: 0, end: 0 }
        },
        {
          src: "https://picsum.photos/687/654",
          dimensions: { width: 687, height: 654 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: "https://picsum.photos/600/1200",
          dimensions: { width: 600, height: 1200 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: "https://picsum.photos/899/450",
          dimensions: { width: 899, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: "https://picsum.photos/800/1200",
          dimensions: { width: 800, height: 1200 },
          parallax: { start: 10, end: -8 }
        }
      ]
    },
    {
      id: 2,
      color: "#ee33ee",
      name: "brings",
      hero: {
        src: "./images/1002-1200x900.jpg",

        dimensions: { width: 1200, height: 900 }
      },

      images: [
        {
          src: "https://picsum.photos/450/1210",
          dimensions: { width: 450, height: 1210 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: "https://picsum.photos/687/654",
          dimensions: { width: 687, height: 654 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: "https://picsum.photos/600/1200",
          dimensions: { width: 600, height: 1200 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: "https://picsum.photos/899/450",
          dimensions: { width: 899, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: "https://picsum.photos/800/1200",
          dimensions: { width: 800, height: 1200 },
          parallax: { start: 10, end: -8 }
        }
      ]
    }
  ]
};

export const mutations = {
  SET_PROJECT(state, projectID) {
    state.currentProject = projectID;
  }
};
export const actions = {
  setProject({ commit }, id) {
    commit("SET_PROJECT", id);
  }
};

export const getters = {
  getProjectByID: state => id => {
    return state.list.find(list => list.id === parseInt(id, 10));
  },

  getNextProject: state => id => {
    const currentIndex = findIndex(state.list, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > state.list.length - 1) return state.list[0];
      return state.list[nextIndex];
    }
    return null;
  },

  getPreviousProject: state => id => {
    const currentIndex = findIndex(state.list, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) return state.list[state.list.length - 1];
      return state.list[prevIndex];
    }
    return null;
  }
};
