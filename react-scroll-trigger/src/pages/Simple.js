import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styled from "styled-components";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

import { removeMarkersFromDOM } from "../utils";

gsap.registerPlugin(ScrollTrigger);

function Simple() {
  const trigger = useRef(null);

  const Box = styled.div`
    position: absolute;
    left: 100px;
    z-index: 100;
    font-size: 120px;
    top: 600px;
    font-size: 11.5em;
  `;

  useEffect(() => {
    //on mount or update
    gsap.set(trigger.current, { alpha: 0 });
    // You can use a ScrollTrigger in a tween or timeline
    const animation = gsap.to(trigger.current, {
      x: 400,
      rotation: 360,
      alpha: 1,
      scrollTrigger: {
        trigger: trigger.current,
        start: "top center",
        end: "top 100px",
        // we can control the timing too, true will link it to scollbar, a number will ease to the scrollbar position
        scrub: true,
        // scrub: 1,
        // pinning can be toggled
        pin: false,
        markers: true,
        id: "simple",
      },
    });

    return () => {
      animation.kill(true);
      ScrollTrigger.getById("simple").kill(true);
      removeMarkersFromDOM();
    };
  });

  return (
    <div className="App">
      <Box ref={trigger}>
        <span role="img" aria-label="Panda">
          🐼
        </span>
      </Box>
    </div>
  );
}

export default Simple;
