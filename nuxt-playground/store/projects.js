import findIndex from 'lodash.findindex';
export const state = () => ({
  list: [
    {
      id: 10,
      color: '#ff00ff',
      images: [
        {
          src: 'https://picsum.photos/600/1200',
          dimensions: { width: 600, height: 1200 },
          parallax: { start: 0, end: 0 }
        },
        {
          src: 'https://picsum.photos/1200/1200',
          dimensions: { width: 1200, height: 1200 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: 'https://picsum.photos/900/450',
          dimensions: { width: 900, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: 'https://picsum.photos/901/450',
          dimensions: { width: 901, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: 'https://picsum.photos/901/400',
          dimensions: { width: 901, height: 400 },
          parallax: { start: 0, end: -0 }
        }
      ]
    },
    {
      id: 1,
      color: '#f0000f',
      images: [
        {
          src: 'https://picsum.photos/450/1210',
          dimensions: { width: 450, height: 1210 },
          parallax: { start: 0, end: 0 }
        },
        {
          src: 'https://picsum.photos/687/654',
          dimensions: { width: 687, height: 654 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: 'https://picsum.photos/600/1200',
          dimensions: { width: 600, height: 1200 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: 'https://picsum.photos/899/450',
          dimensions: { width: 899, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: 'https://picsum.photos/800/1200',
          dimensions: { width: 800, height: 1200 },
          parallax: { start: 10, end: -8 }
        }
      ]
    },
    {
      id: 2,
      color: '#ee33ee',
      images: [
        {
          src: 'https://picsum.photos/450/1210',
          dimensions: { width: 450, height: 1210 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: 'https://picsum.photos/687/654',
          dimensions: { width: 687, height: 654 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: 'https://picsum.photos/600/1200',
          dimensions: { width: 600, height: 1200 },
          parallax: { start: 10, end: -10 }
        },
        {
          src: 'https://picsum.photos/899/450',
          dimensions: { width: 899, height: 450 },
          parallax: { start: 0, end: -0 }
        },
        {
          src: 'https://picsum.photos/800/1200',
          dimensions: { width: 800, height: 1200 },
          parallax: { start: 10, end: -8 }
        }
      ]
    }
  ]
});

export const getters = {
  getProjectByID: (state) => (id) => {
    return state.list.find((list) => list.id === parseInt(id, 10));
  },

  getNextProject: (state) => (id) => {
    const currentIndex = findIndex(state.list, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex > state.list.length - 1) return null;
      return state.list[nextIndex];
    }
    return null;
  },

  getPreviousProject: (state) => (id) => {
    const currentIndex = findIndex(state.list, { id: parseInt(id, 10) });
    if (currentIndex > -1) {
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) return null;
      return state.list[prevIndex];
    }
    return null;
  }
};
