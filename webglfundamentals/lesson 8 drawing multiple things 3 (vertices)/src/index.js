import {
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes,
  setUniforms,
  createProgramInfo,
} from "./utils";

import mountain from "./assets/mountain.jpg";
import food from "./assets/food.jpg";
import field from "./assets/field.jpg";
import "./index.css";

import { loadImageAndCreateTextureInfo } from "./webgl";
import { m4 } from "./m4";
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
  mountainSprite.fullScreen(isFullScreen);
}

const spritesToDraw = [
  mountainSprite,
  // new Sprite(gl, {
  //   programInfo,
  //   texture: loadImageAndCreateTextureInfo(field, gl),
  // }),
  // new Sprite(gl, {
  //   programInfo,
  //   texture: loadImageAndCreateTextureInfo(food, gl),
  // }),
];

function render() {
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
    sprite.drawVertices();

    // Set the uniforms.
    setUniforms(programInfo, sprite.uniforms);

    // use the correct texture
    gl.bindTexture(gl.TEXTURE_2D, sprite.texture.texture);
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
  });
}

// Draw the scene.
function translations(time) {
  time = time * 0.001;

  resizeCanvasToDisplaySize(gl.canvas);

  spritesToDraw.forEach((sprite, index) => {
    const destX = gl.canvas.width / 2;
    const destY = gl.canvas.height / 2;

    const { matrix, texture, uniforms, bufferInfo } = sprite;
    // update imageUniforms
    matrix.save();
    // this matrix will translate our quad to dstX, dstY
    matrix.translate(destX, destY);
    //rotate it on the left top corner
    // matrix.rotateZ(time);
    //offset it so we rotate from center of image
    matrix.translate(texture.width / -2, texture.height / -2);

    // let's set the image in screen space
    var screenMatrix = m4.orthographic(
      0,
      gl.canvas.width,
      gl.canvas.height,
      0,
      -1,
      1
    );

    // this matrix moves the origin to the one represented by
    // the current matrix stack.
    screenMatrix = m4.multiply(screenMatrix, matrix.getCurrentMatrix());

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    screenMatrix = m4.scale(screenMatrix, texture.width, texture.height, 1);

    uniforms.u_matrix = screenMatrix;

    sprite.x = destX;
    sprite.y = destY;

    // set the points in pixels to distort the vertex
    const w = texture.width;
    const h = texture.height;

    const cos = Math.cos(time) * 100;
    const sin = Math.sin(time) * 75;

    const tl = { x: destX + 0 + cos * 0.25, y: destY + 0 };
    const bl = { x: destX + 0, y: destY + h + sin * 0.7 };
    const tr = { x: destX + w - sin, y: destY + 0 + cos * 0.4 };
    const br = { x: destX + w + cos, y: destY + h - sin };
    // attributes updating
    const vertexPositions = [
      tl.x,
      tl.y,
      bl.x,
      bl.y,
      tr.x,
      tr.y,
      tr.x,
      tr.y,
      bl.x,
      bl.y,
      br.x,
      br.y,
    ];
    // this will set the vertex at the exact absolute pixel. not relative to it's own position!
    sprite.updateVertices(vertexPositions);

    matrix.restore();
  });
}

function update(time) {
  translations(time);
  render();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
