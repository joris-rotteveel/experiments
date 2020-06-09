import React, { useState } from "react";
import "./App.css";

import CanvasEffect from "./CanvasEffect";
import imageA from "./assets/a.jpg";
import imageB from "./assets/b.jpg";
import imageC from "./assets/c.jpg";
import imageD from "./assets/d.jpg";
import imageE from "./assets/e.jpg";

function App() {
  const [imageData, setImageData] = useState([]);

  const onLoad = (event) => {
    const element = event.target;
    element.classList.add("effect__img--is-enhanced");
    const index = imageData.length + 1;

    const newImageData = [...imageData, { element, index }];
    setImageData(newImageData);
  };

  const onImageClick = () => {
    console.log("click");
  };

  return (
    <div className="App">
      <section className="section section--start">
        <div className="effect">
          <div className="effect__space-ensurer" />
          <img
            src={imageA}
            alt=" alt name"
            className="effect__img"
            onLoad={onLoad}
            onClick={onImageClick}
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
          <img
            src={imageB}
            alt=" alt name"
            className="effect__img"
            onLoad={onLoad}
            onClick={onImageClick}
          />
          Damn right it's better than yours
          <br />I can teach you, but I have to charge
        </div>
      </section>
      <CanvasEffect imageData={imageData} />
    </div>
  );
}

export default App;
