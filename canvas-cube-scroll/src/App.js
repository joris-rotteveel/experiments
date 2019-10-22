import React, { useState } from "react";
import "./App.css";

import CanvasEffect from "./CanvasEffect";
import imagePath from "./assets/img.jpg";

function App() {
  const [showContent, setShowContent] = useState(false);

  const onCubeClick = () => {
    window.scrollTo(0, 0);
    setShowContent(true);
  };
  const onOutsideCLick = () => {
    setShowContent(false);
  };
  const className = `section__copy section__copy--${
    showContent ? "show" : "hide"
  }`;
  return (
    <div className="app">
      <section className="section section--start">
        <div className={className}>
          <div>
            <h1 className="header--close" onClick={onOutsideCLick}>
              X
            </h1>
          </div>
          <h1>How I travel</h1>
          <h3>Car</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            cursus non velit at posuere. Aliquam at massa eleifend, varius ipsum
            a, cursus nisl. Quisque pulvinar in elit vel consequat. Sed neque
            sem, aliquam eget laoreet sed, vulputate a urna. Vestibulum aliquam
            varius mauris eu auctor. Quisque at urna ut erat suscipit convallis.
            Aliquam hendrerit felis nec nunc tempor, a consectetur orci sodales.
            Nullam scelerisque mollis urna non egestas.
          </p>
          <h3>Public Transport</h3>
          <p>
            Pellentesque non facilisis sem, id ullamcorper leo. Maecenas vel
            ligula at ipsum faucibus laoreet sed ut risus. Fusce consequat orci
            nec augue ornare facilisis. Cras auctor dolor vel justo porta
            dictum.
          </p>
          <p>
            Maecenas in felis in arcu consequat sodales. Praesent faucibus massa
            at ultrices viverra.
          </p>
          <h3>Walking and Cycling</h3>
          <p>
            Quisque id neque lorem. Nulla et vulputate lacus, nec tincidunt
            arcu. Duis nec gravida ante. Class aptent taciti sociosqu ad litora
            torquent per conubia nostra, per inceptos himenaeos. Nullam lobortis
            metus ex, vel iaculis enim ultricies in. Phasellus sed ullamcorper
            mi. Mauris massa nulla, venenatis sit amet fermentum at, consequat
            vel nulla. Mauris in elit turpis. Sed auctor lacus ac semper
            malesuada. Petesque posuere malesuada aliquam. Ut eget elit sed
            turpis sodales dictum. Aenean sollicitudin metus ac porta laoreet.
            Cras ut tristique lorem. Sed imperdiet tortor in orci finibus
            posuere. Praesent viverra, dolor sed scelerisque placerat, turpis
            tortor dictum tellus, sit amet faucibus risus sapien eu mauris.
            Pellentesque et dignissim ex. Sed leo velit, elementum in nisi non,
            faucibus ullamcorper tellus. Ut at vulputate augue. Nulla dui odio,
            pharetra id libero et, viverra luctus erat. Cras erat dui, iaculis
            quis erat ac, volutpat suscipit est.
          </p>
        </div>
      </section>
      <CanvasEffect
        onCubeClick={onCubeClick}
        onOutsideClick={onOutsideCLick}
        centerCube={!showContent}
      />
    </div>
  );
}

export default App;
