import gsap from "gsap";
import escape from "lodash.escape";
import pullAllBy from "lodash.pullallby";

import "./index.css";
// https://docs.google.com/spreadsheets/d/1NnurPXUWJxIb0Rd6HLwJ1IdVoRpf_b_vgUlLRgXyjIc/edit?usp=sharing
const googs = "1NnurPXUWJxIb0Rd6HLwJ1IdVoRpf_b_vgUlLRgXyjIc";
const API = `https://spreadsheets.google.com/feeds/cells/${googs}/1/public/full?alt=json`;
console.log(API);
const currentIDs = [];
let defaultNames = [];

let scrollSpeed = 0.5;
const namePadding = 0;

let animatables;
let names = [...defaultNames];

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 38) scrollSpeed += 0.1;
  if (e.keyCode === 40) scrollSpeed -= 0.1;

  console.log(scrollSpeed);
});

const getNewName = () => {
  if (names.length > 0) {
    return names.shift();
  }
  names = [...defaultNames];
  return names.shift();
};

const update = () => {
  animatables.forEach((animatable, index) => {
    animatable.y -= scrollSpeed;
    if (animatable.y < -animatable.height - namePadding) {
      const target =
        animatables[animatables.length - 1].y +
        animatables[animatables.length - 1].height +
        namePadding;

      animatable.ref.innerHTML = getNewName().name;
      animatable.height = animatable.ref.getBoundingClientRect().height;
      // move this one to be the last in the array
      animatables.push(animatables.shift());

      gsap.set(animatable, { y: target });
    }

    gsap.set(animatable.ref, { y: animatable.y });
  });
  requestAnimationFrame(update);
};

const startScroll = () => {
  const nameItems = document.querySelectorAll(".scroller__item");
  let previous;
  animatables = [...nameItems].map((item, index) => {
    let ypos = 0;
    if (previous) {
      ypos = previous.y + previous.height + namePadding;
    }
    item.innerHTML = getNewName().name;
    const object = {
      ref: item,
      y: ypos,
      height: item.getBoundingClientRect().height,
    };
    previous = object;

    return object;
  });

  requestAnimationFrame(update);
};

const getData = (initial) => {
  fetch(API)
    .then((response) => response.json())
    .then((data) => {
      const entries = data.feed?.entry || [];
      const tempNames = [];
      entries.forEach((entry, index) => {
        const content = entry.gs$cell;
        if (
          content.col === "2" &&
          content.inputValue.toLowerCase() !== "name"
        ) {
          //TODO: check if entry isn't already there
          const id = content.col + "" + content.row;
          const currentIndex = currentIDs.indexOf(id);
          const isDeleteFlag = content.inputValue.toLowerCase() === "x";
          if (!isDeleteFlag && currentIndex === -1) {
            currentIDs.push(id);

            tempNames.push({ id: id, name: escape(content.inputValue) });
            defaultNames.push({ id: id, name: escape(content.inputValue) });
          } else {
            //check to see if the name is removed

            if (isDeleteFlag) {
              pullAllBy(names, [{ id: id }], "id");
              pullAllBy(defaultNames, [{ id: id }], "id");
            }
          }
        }
      });

      names = [...tempNames, ...names];

      if (initial) {
        defaultNames = [...tempNames];
        startScroll();
      }

      setTimeout(() => {
        getData();
      }, 3000);
    });
};

getData(true);
