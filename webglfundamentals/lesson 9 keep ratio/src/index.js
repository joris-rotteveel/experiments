import gsap from "gsap";
import {
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  createProgramInfo,
} from "./utils";

import mountain from "./assets/mountain.jpg";
import "./index.css";

import { loadImageAndCreateTextureInfo } from "./webgl";
import Sprite from "./sprite";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

let isFullScreen = false;
document.addEventListener("mousedown", onMouseDown);

// setup GLSL program
var programInfo = createProgramInfo(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);

const mountainSprite = new Sprite(gl, {
  programInfo,
  texture: loadImageAndCreateTextureInfo(mountain, gl),
});

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
  // attributes updating

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

const spritesToDraw = [mountainSprite];

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
    sprite.update();
  });
}

function update(time) {
  updateSprites(time);
  renderSprites();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
