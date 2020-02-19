import React, { useEffect } from "react";
import "./App.css";
import miles from "./miles.jpg";



class Item {
  constructor(element, { direction }) {
    this.element = element;
    this.image = this.element.querySelector(".item__img");
    this.direction = direction;
  }

  update = vel => {
    const skew = vel * 1.5 * this.direction;
    const hue = vel * 350 * this.direction;
    const sat = 100 * Math.abs(vel);
    const blur = Math.abs(vel * 10) + "px";
    const scale = Math.max(0.2, 1 - Math.abs(vel / 20));
    const rotate = vel*-3;

    const scaleTransform = `scale(${scale})`;
    const skewTransform = `skewY(${skew}deg)`;
    const hueFilter = `filter:hue-rotate(${hue}deg);`;
    const rotateTransform=`rotate(${rotate}deg)`
    const satFilter = `filter:saturate(${sat});`;
    const blurFilter = `filter:blur(${blur});`;

    const rect = this.element.getBoundingClientRect();
    const relativeY = rect.top;
    const height = rect.height;
    const bottomY = relativeY + height;

    const pct = relativeY / window.innerHeight;

    const translateTransform = `translate3d(0px,${skew * 50}px,  0)`;

    this.element.style.transform = `${skewTransform} `;

    this.image.style = `${hueFilter}`;
    this.image.style.transform = `${translateTransform} ${scaleTransform} ${rotateTransform}`;
  };
}

const App = () => {
  const items = [];
  const data = {
    ease: 0.13,
    current: 0,
    last: 0
  };
  // refs
  const container = React.createRef();
  const content = React.createRef();
  // functions
  const setHeight = () => {
    // this will create a scrollbar
    document.body.style.height = `${content.current.offsetHeight}px`;
    startAnimationFrame();
  };

  const scroll = () => {
    //update the data
    data.current = window.scrollY;
  };

  const onMount = () => {
    setHeight();
    startAnimationFrame();
  };

  const addItem = element => {
    items.push(
      new Item(element, { direction: items.length % 2 === 0 ? 1 : -1 })
    );
  };

  const resize = () => {
    setHeight();
    scroll();
  };

  const update = () => {
    data.last = lerp(data.last, data.current, data.ease);

    const delta = data.current - data.last;
    const acceleration = delta / 250;
    const velocity = acceleration;

    const scrollTransfrorm = `translate3d(0, -${data.last}px, 0)`;

    items.forEach(item => item.update(velocity));
    content.current.style.transform = `${scrollTransfrorm}`;

    startAnimationFrame();
  };

  const startAnimationFrame = () => {
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", scroll, { passive: true });
  window.addEventListener("resize", resize, { passive: true });

  // state changes and lifecycle
  // on mount
  useEffect(onMount, []);

  const complex = (
    <div className="item" ref={addItem}>
      <div className="item__img-wrap">
        <img src={miles} className="item__img " />
      </div>
      <div className="item__caption">
        <h2 className="item__caption-title">My Milkshake</h2>
        <p className="item__caption-copy">Is better than yours!</p>
      </div>
    </div>
  );

  return (
    <div>
      <div data-scroll ref={container}>
        <div data-scroll-content ref={content}>
          {complex}
          {complex}
          {complex}
          {complex}
        </div>
      </div>
    </div>
  );
};

export default App;
