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
// enable alpha
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


const spritesToDraw = [];
const positionLookup = {};

gsap.set(".ui", { autoAlpha: 0 });


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
    sprite.update();
  });
}

function update() {
  updateSprites();
  renderSprites();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
