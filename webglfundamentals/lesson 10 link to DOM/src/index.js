import gsap from "gsap";
import {
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  createProgramInfo,
} from "./utils";

import "./index.css";

import { fromImageAndCreateTextureInfo } from "./webgl";
import Sprite from "./sprite";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

let isFullScreen = false;
let moveByMouse = false;
let currentSprite;
let mouseY = 0;
let ease = 1;
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mousemove", onMouseMove);

// setup GLSL program
let programInfo = createProgramInfo(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);

const spritesToDraw = [];
const positionLookup = {};

const images = document.querySelectorAll(".js-transfer-to-canvas");
images.forEach((image) => {
  if (image.complete) {
    addImageToCanvas(image);
  } else {
    image.addEventListener("load", onImageLoad);
  }
});

function onMouseMove(event) {
  mouseY = event.clientY;
}

function onImageLoad(event) {
  event.target.removeEventListener("load", onImageLoad);
  const element = event.target;
  addImageToCanvas(element);
}

function addImageToCanvas(imageElement) {
  const sprite = new Sprite(gl, {
    programInfo,
    texture: fromImageAndCreateTextureInfo(imageElement, gl),
  });
  const index = spritesToDraw.length;
  spritesToDraw.push(sprite);

  const rect = imageElement.getBoundingClientRect();
  const DOMPostion = { x: rect.left, y: rect.top + window.scrollY };

  positionLookup[index] = {
    DOMPostion,
  };

  imageElement.classList.add("effect__img--is-enhanced");
}

function onMouseDown(e) {
  // find out if click is withing a sprite bounds/rect
  isFullScreen = !isFullScreen;

  if (isFullScreen) {
    document.body.classList.add("is-full-screen");
  } else {
    document.body.classList.remove("is-full-screen");
  }

  const sprite = spritesToDraw[0];
  currentSprite = isFullScreen ? sprite : null;

  const ratio = sprite.texture.width / sprite.texture.height;
  // set the points in pixels to distort the vertex
  const w = isFullScreen ? gl.canvas.width : sprite.texture.width;
  const h = w / ratio;

  //relative to it's current x/y!
  const tl = { x: 0, y: 0 };
  const bl = { x: 0, y: h };
  const tr = { x: w, y: 0 };
  const br = { x: w, y: h };

  const { topLeft, bottomLeft, topRight, bottomRight } = sprite.getVertices();
  const animation = { topLeft, bottomLeft, topRight, bottomRight };

  const onUpdate = () => {
    sprite.setVertices(
      animation.topLeft,
      animation.bottomLeft,
      animation.topRight,
      animation.bottomRight
    );
  };
  if (isFullScreen) {
    gsap.to(sprite, { x: 0, y: 0, delay: 0.5 });
    ease = 1;
  } else {
    ease = 0.2;
    // gsap.to(sprite, { x: 0, y: 0, delay: 0.5 });
  }

  const timeline = gsap.timeline({
    onUpdate: onUpdate,
    onComplete: () => {
      moveByMouse = isFullScreen;
      ease = 1;
    },
  });

  const duration = 0.25;
  timeline.to(".section", { alpha: isFullScreen ? 0 : 1, stagger: 0.2 });
  timeline.to(animation.topLeft, {
    x: tl.x,
    y: tl.y,
    duration,
  });
  timeline.to(animation.topRight, {
    x: tr.x,
    y: tr.y,
    duration,
  });
  timeline.to(animation.bottomLeft, {
    x: bl.x,
    y: bl.y,
    duration,
  });
  timeline.to(animation.bottomRight, {
    x: br.x,
    y: br.y,
    duration,
  });
}

// render everything
function renderSprites() {
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var lastUsedProgramInfo = null;
  var lastUsedBufferInfo = null;

  spritesToDraw.forEach(function (sprite) {
    var programInfo = sprite.programInfo;
    var bufferInfo = sprite.bufferInfo;

    var bindBuffers = false;
    if (programInfo !== lastUsedProgramInfo) {
      lastUsedProgramInfo = programInfo;
      gl.useProgram(programInfo.program);

      // We have to rebind buffers when changing programs because we
      // only bind buffers the program uses. So if 2 programs use the same
      // bufferInfo but the 1st one uses only positions then when
      // we switch to the 2nd one some of the attributes will not be on.
      bindBuffers = true;
    }

    // Setup all the needed attributes.
    if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
      lastUsedBufferInfo = bufferInfo;

      setBuffersAndAttributes(gl, programInfo, bufferInfo);
    }
    sprite.render();

    // Set the uniforms.
    setUniforms(programInfo, sprite.uniforms);

    // use the correct texture
    gl.bindTexture(gl.TEXTURE_2D, sprite.texture.texture);
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
  });
}

// update the items in the scene.
function updateSprites() {
  resizeCanvasToDisplaySize(gl.canvas);

  spritesToDraw.forEach((sprite, index) => {
    const baseInfo = positionLookup[index];
    const { DOMPostion } = baseInfo;

    if (isFullScreen) {
      if (moveByMouse) {
        const pctY = mouseY / window.innerHeight;
        const overlap = currentSprite.getHeight() - window.innerHeight;
        sprite.y = -overlap * pctY;
      }
    } else {
      const newX = DOMPostion.x + window.scrollX;
      const newY = DOMPostion.y - window.scrollY;
      sprite.x += (newX - sprite.x) * ease;
      sprite.y += (newY - sprite.y) * ease;
    }

    sprite.update();
  });
}

function update() {
  updateSprites();
  renderSprites();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
