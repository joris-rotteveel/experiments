import gsap from "gsap";
import {
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  createProgramInfo,
} from "./utils";

// import mountain from "./assets/mountain.jpg";
import "./index.css";

import { fromImageAndCreateTextureInfo } from "./webgl";
import Sprite from "./sprite";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

let isFullScreen = false;
// document.addEventListener("mousedown", onMouseDown);

// setup GLSL program
let programInfo = createProgramInfo(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);

const spritesToDraw = [];
const positionLookup = {};

const mountainImage = document.querySelector(".js-transfer-to-canvas");

if (mountainImage.complete) {
  addImageToCanvas(mountainImage);
} else {
  mountainImage.addEventListener("load", onImageLoad);
}

function onImageLoad(event) {
  event.target.removeEventListener("load", onImageLoad);
  const element = event.target;
  addImageToCanvas(element);
}

function addImageToCanvas(imageElement) {
  const sprite = new Sprite(gl, {
    programInfo,
    texture: fromImageAndCreateTextureInfo(mountainImage, gl),
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

function onMouseDown() {
  isFullScreen = !isFullScreen;
  const sprite = spritesToDraw[0];
  const ratio = sprite.texture.width / sprite.texture.height;
  // set the points in pixels to distort the vertex
  const w = isFullScreen ? gl.canvas.width : sprite.texture.width;
  const h = w / ratio;

  const tl = { x: 0, y: 0 };
  const bl = { x: 0, y: h };
  const tr = { x: w, y: 0 };
  const br = { x: w, y: h };

  // this will set the vertex at the exact absolute pixel. not relative to it's own position!
  const xpos = isFullScreen ? 0 : 100;
  const ypos = isFullScreen ? 0 : 10;
  const { topLeft, bottomLeft, topRight, bottomRight } = sprite.getVertices();
  const animation = { topLeft, bottomLeft, topRight, bottomRight };

  const timeline = gsap.timeline();
  const onUpdate = () => {
    sprite.setVertices(
      animation.topLeft,
      animation.bottomLeft,
      animation.topRight,
      animation.bottomRight
    );
  };

  timeline.to(sprite, {
    x: xpos,
    y: ypos,
    duration: 0.1,
  });
  timeline.to(animation.topLeft, {
    x: tl.x,
    y: tl.y,
    duration: 0.1,
    onUpdate: onUpdate,
  });
  timeline.to(animation.bottomLeft, {
    x: bl.x,
    y: bl.y,
    duration: 0.1,
    onUpdate: onUpdate,
  });
  timeline.to(animation.topRight, {
    x: tr.x,
    y: tr.y,
    duration: 0.1,
    onUpdate: onUpdate,
  });
  timeline.to(animation.bottomRight, {
    x: br.x,
    y: br.y,
    duration: 0.1,
    onUpdate: onUpdate,
  });
}

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

// Draw the scene.
function updateSprites(time) {
  time = time * 0.001;

  resizeCanvasToDisplaySize(gl.canvas);

  spritesToDraw.forEach((sprite, index) => {
    const baseInfo = positionLookup[index];
    const { DOMPostion } = baseInfo;

    const newY = DOMPostion.y - window.scrollY;
    const newX = DOMPostion.x + window.scrollX;
    sprite.x = newX;
    sprite.y = newY;

    sprite.update();
  });
}

function update(time) {
  updateSprites(time);
  renderSprites();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
