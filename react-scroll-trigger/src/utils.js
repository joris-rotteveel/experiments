export const removeMarkersFromDOM = () => {
  //remove the markers
  document.querySelectorAll('[class^="gsap-"]').forEach((el) => {
    el.remove();
  });
};
