import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styled from "styled-components";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

import { removeMarkersFromDOM } from "../utils";

gsap.registerPlugin(ScrollTrigger);

function TimelinePage() {
  const trigger = useRef(null);
  const panda = useRef(null);

  const Box = styled.div`
    position: absolute;
    top: 75vh;
    left: 0;
    width: 100vw;
    height: 100vh;

    padding: 20px;
  `;
  const Panda = styled.div`
    font-size: 90px;
    width: 10vw;
    height: 10vw;
  `;

  useEffect(() => {
    //on mount or update
    // You can use a ScrollTrigger in a tween or timeline
    const animation = gsap.timeline({
      scrollTrigger: {
        trigger: trigger.current,
        start: "center bottom",
        end: "center top",
        scrub: true,
        markers: true,
        id: "simple",
      },
    });
    animation.to(panda.current, { yPercent: 250, duration: 1 });
    animation.to(panda.current, { scale: 2, duration: 3 });
    animation.to(panda.current, { xPercent: 350, scale: 1, duration: 1 });

    return () => {
      animation.kill(true);
      ScrollTrigger.getById("simple").kill(true);
      removeMarkersFromDOM();
    };
  });

  return (
    <div className="App">
      <Box ref={trigger}>
        <Panda ref={panda} role="img" aria-label="Panda">
          🐼
        </Panda>
      </Box>
    </div>
  );
}

export default TimelinePage;
