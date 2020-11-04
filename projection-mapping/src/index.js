import { Curtains, Plane, Vec2 } from "curtainsjs";
import "./index.css";
import { vertexShader } from "./shaders/vertex";
import { fragmentShader } from "./shaders/fragment";

window.addEventListener("load", () => {
  // track the mouse positions to send it to the shaders
  const mousePosition = new Vec2();
  // we will keep track of the last position in order to calculate the movement strength/delta
  const mouseLastPosition = new Vec2();

  const deltas = {
    max: 0,
    applied: 0,
  };

  // set up our WebGL context and append the canvas to our wrapper
  const curtains = new Curtains({
    container: "canvas",
    watchScroll: false, // no need to listen for the scroll in this example
    pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
  });

  // handling errors
  curtains
    .onError(() => {
      // we will add a class to the document body to display original images
      document.body.classList.add("no-curtains");
    })
    .onContextLost(() => {
      // on context lost, try to restore the context
      curtains.restoreContext();
    });

  // get our plane element
  const planeElements = document.getElementsByClassName("curtain");

  // some basic parameters
  const params = {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    widthSegments: 20,
    heightSegments: 20,
    uniforms: {
      resolution: {
        // resolution of our plane
        name: "uResolution",
        type: "2f", // notice this is an length 2 array of floats
        value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
      },
      time: {
        // time uniform that will be updated at each draw call
        name: "uTime",
        type: "1f",
        value: 0,
      },
      mousePosition: {
        // our mouse position
        name: "uMousePosition",
        type: "2f", // again an array of floats
        value: mousePosition,
      },
      mouseMoveStrength: {
        // the mouse move strength
        name: "uMouseMoveStrength",
        type: "1f",
        value: 0,
      },
    },
  };

  // create our plane
  const simplePlane = new Plane(curtains, planeElements[0], params);

  // if there has been an error during init, simplePlane will be null
  simplePlane
    .onReady(() => {
      // set a fov of 35 to reduce perspective (we could have used the fov init parameter)
      simplePlane.setPerspective(35);

      // apply a little effect once everything is ready
      deltas.max = 2;

      // now that our plane is ready we can listen to mouse move event
      const wrapper = document.getElementById("page-wrap");

      wrapper.addEventListener("mousemove", (e) => {
        handleMovement(e, simplePlane);
      });
    })
    .onRender(() => {
      // increment our time uniform
      simplePlane.uniforms.time.value += 0.1;

      // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
      deltas.applied += (deltas.max - deltas.applied) * 0.02;
      deltas.max += (0 - deltas.max) * 0.01;

      // send the new mouse move strength value
      simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;
    })
    .onAfterResize(() => {
      const planeBoundingRect = simplePlane.getBoundingRect();
      simplePlane.uniforms.resolution.value = [
        planeBoundingRect.width,
        planeBoundingRect.height,
      ];
    })
    .onError(() => {
      // we will add a class to the document body to display original images
      document.body.classList.add("no-curtains");
    });

  // handle the mouse move event
  function handleMovement(e, plane) {
    // update mouse last pos
    mouseLastPosition.copy(mousePosition);

    const mouse = new Vec2();

    // touch event
    if (e.targetTouches) {
      mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
    // mouse event
    else {
      mouse.set(e.clientX, e.clientY);
    }

    // lerp the mouse position a bit to smoothen the overall effect
    mousePosition.set(
      curtains.lerp(mousePosition.x, mouse.x, 0.3),
      curtains.lerp(mousePosition.y, mouse.y, 0.3)
    );

    // convert our mouse/touch position to coordinates relative to the vertices of the plane and update our uniform
    plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(
      mousePosition
    );

    // calculate the mouse move strength
    if (mouseLastPosition.x && mouseLastPosition.y) {
      let delta =
        Math.sqrt(
          Math.pow(mousePosition.x - mouseLastPosition.x, 2) +
            Math.pow(mousePosition.y - mouseLastPosition.y, 2)
        ) / 30;
      delta = Math.min(4, delta);
      // update max delta only if it increased
      if (delta >= deltas.max) {
        deltas.max = delta;
      }
    }
  }
});
