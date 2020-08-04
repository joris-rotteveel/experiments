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
const closeFullScreen = document.querySelector(".ui__close");
const gl = canvas.getContext("webgl");

let isFullScreen = false;
let moveByMouse = false;
// let currentSprite;
let currentIndex = -1;
let mouseY = 0;
let ease = 1;

const spritesToDraw = [];
const positionLookup = {};

gsap.set(".ui", { autoAlpha: 0 });

document.querySelectorAll(".js-image-stub").forEach((e) => {
  e.addEventListener("mousedown", onImageMouseDown);
});
document.addEventListener("mousemove", onMouseMove);
closeFullScreen.addEventListener("click", onCloseMouseDown);

// setup GLSL program
let programInfo = createProgramInfo(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);

document.querySelectorAll(".js-transfer-to-canvas").forEach((image) => {
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
function onCloseMouseDown(e) {
  isFullScreen = false;
  //let it ease to the DOM position
  ease = 0.2;
  moveByMouse = false;
  const sprite = spritesToDraw[currentIndex];

  const ratio = sprite.texture.width / sprite.texture.height;
  // set the points in pixels to distort the vertex
  const w = sprite.texture.width;
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

  const timeline = gsap.timeline({
    onUpdate: onUpdate,
    onComplete: () => {
      ease = 1;
    },
  });

  const duration = 0.25;

  timeline.to(".ui", { autoAlpha: 0, duration, stagger: 0.2 });
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
  timeline.to(".section", { autoAlpha: 1, stagger: 0.2 });
  currentIndex = -1;
  document.body.classList.remove("is-full-screen");
}

function onImageMouseDown(e) {
  currentIndex = parseInt(e.target.dataset.imageIndex);
  // find out if click is withing a sprite bounds/rect
  isFullScreen = true;

  document.body.classList.add("is-full-screen");

  const sprite = spritesToDraw[currentIndex];

  const ratio = sprite.texture.width / sprite.texture.height;
  // set the points in pixels to distort the vertex
  const w = gl.canvas.width;
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

  ease = 1;

  const timeline = gsap.timeline({
    onUpdate: onUpdate,
    onComplete: () => {
      moveByMouse = true;
      ease = 1;
      gsap.to(".ui", { autoAlpha: 1 });
    },
  });

  const duration = 0.25;
  timeline.to(".section", { autoAlpha: 0 });
  timeline.to(sprite, { x: 0, y: 0 });

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

    if (isFullScreen && index === currentIndex) {
      if (moveByMouse) {
        const pctY = mouseY / window.innerHeight;
        const overlap = sprite.getHeight() - window.innerHeight;
        const target = -overlap * pctY;
        sprite.y += (target - sprite.y) * 0.5;
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
