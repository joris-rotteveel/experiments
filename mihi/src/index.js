import gsap from "gsap";
import escape from "lodash.escape";

import "./index.css";

const API =
  "https://spreadsheets.google.com/feeds/cells/1jbdZ46T6sr-OUrvVtx3GqsP_7Vcy-JJOZrEr6Ycckoc/1/public/full?alt=json";

const currentIDs = [];
let defaultNames = [];
const scrollSpeed = 3;
const namePadding = 120;

let animatables;
let names = [...defaultNames];

const getNewName = () => {
  if (names.length > 0) {
    return names.shift();
  }

  return defaultNames[Math.round(Math.random() * (defaultNames.length - 1))];
};

const update = () => {
  animatables.forEach((animatable, index) => {
    animatable.y -= scrollSpeed;
    if (animatable.y < -animatable.height - namePadding) {
      const target =
        animatables[animatables.length - 1].y +
        animatables[animatables.length - 1].height +
        namePadding;

      animatable.ref.innerHTML = getNewName();
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
    item.innerHTML = getNewName();
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

          if (currentIDs.indexOf(id) === -1) {
            currentIDs.push(id);
            tempNames.push(escape(content.inputValue));
            defaultNames.push(escape(content.inputValue));
          }
        }
      });

      names = [...tempNames, ...names];

      if (initial) {
        defaultNames = tempNames.slice(0, tempNames.length - 1);
        startScroll();
      }

      setTimeout(() => {
        getData();
      }, 3000);
    });
};

getData(true);
