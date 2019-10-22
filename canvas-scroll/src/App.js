import React, { useState } from "react";
import "./App.css";

import CanvasEffect from "./CanvasEffect";
import imagePath from "./assets/img.jpg";

function App() {
  const [imageData, setImageData] = useState([]);
  const [scrollData, setScrollData] = useState({
    ease: 0.13,
    current: 0,
    last: 0
  });

  const onLoad = event => {
    const element = event.target;
    const newImageData = [...imageData, { element }];
    setImageData(newImageData);
  };

  const scroll = () => {
    const newScrollData = { ...scrollData };

    newScrollData.current = window.scrollY;
    // setScrollData(newScrollData);
  };
  window.addEventListener("scroll", scroll, { passive: true });

  return (
    <div className="App">
      <section className="section section--start">
        <div className="effect">
          <div className="effect__space-ensurer" />
          <img
            src={imagePath}
            alt=" alt name"
            className="effect__img"
            onLoad={onLoad}
          />
        </div>
        <div className="section__copy">
          <h1>My milkshake</h1>
          My milkshake brings all the boys to the yard.
          <br /> And they're like, it's better than yours <br />
          Damn right it's better than yours <br />I can teach you, but I have to
          charge <br />
          My milkshake brings all the boys to the yard <br />
          And they're like, it's better than yours
          <br />
          Damn right it's better than yours
          <br />I can teach you, but I have to charge
          <br /> My milkshake brings all the boys to the yard.
          <br /> And they're like, it's better than yours <br />
          Damn right it's better than yours <br />I can teach you, but I have to
          charge <br />
          My milkshake brings all the boys to the yard <br />
          And they're like, it's better than yours
          <br />
          Damn right it's better than yours
          <br />I can teach you, but I have to charge
        </div>
      </section>
      <CanvasEffect imageData={imageData} scrollOffset={scrollData.current}/>
    </div>
  );
}

export default App;
