import {
  resizeCanvasToDisplaySize,
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  setUniforms,
  createProgramInfo,
} from "./utils";

import mountain from "./assets/mountain.jpg";
import food from "./assets/food.jpg";
import "./index.css";
import { loadImageAndCreateTextureInfo } from "./webgl";
import { m4 } from "./m4";
import MatrixStack from "./matrix-stack";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

const imageTextureInfo = loadImageAndCreateTextureInfo(mountain, gl);
const foodTextureInfo = loadImageAndCreateTextureInfo(food, gl);

const imageMatrixStack = new MatrixStack();
const imageBufferInfo = createBufferInfoFromArrays(gl, {
  position: {
    numComponents: 2,
    // a single quad
    data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
  },
  texcoord: {
    numComponents: 2,
    data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
  },
});
const imageUniforms = {
  u_matrix: m4.identity(),
  u_textureMatrix: m4.identity(),
};

// setup GLSL program
var programInfo = createProgramInfo(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);

const objectsToDraw = [
  {
    programInfo: programInfo,
    bufferInfo: imageBufferInfo,
    uniforms: imageUniforms,
    texture: imageTextureInfo,
  },
];

function render() {
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var lastUsedProgramInfo = null;
  var lastUsedBufferInfo = null;

  objectsToDraw.forEach(function (object) {
    var programInfo = object.programInfo;
    var bufferInfo = object.bufferInfo;
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

    // Set the uniforms.
    setUniforms(programInfo, object.uniforms);

    // use the correct texture
    gl.bindTexture(gl.TEXTURE_2D, object.texture.texture);
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
  });
}

// Draw the scene.
function translations(time) {
  time = time * 0.001;

  resizeCanvasToDisplaySize(gl.canvas);

  const destX = gl.canvas.width / 2 + (Math.cos(time) * gl.canvas.width) / 2;
  const destY = gl.canvas.height / 2;
  // update imageUniforms
  imageMatrixStack.save();
  // this matrix will translate our quad to dstX, dstY
  imageMatrixStack.translate(destX, destY);
  //rotate it on the left top corner
  imageMatrixStack.rotateZ(time);
  //offset it so we rotate from center of image
  imageMatrixStack.translate(
    imageTextureInfo.width / -2,
    imageTextureInfo.height / -2
  );

  // let's set the image in screen space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // this matrix moves the origin to the one represented by
  // the current matrix stack.
  matrix = m4.multiply(matrix, imageMatrixStack.getCurrentMatrix());

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.scale(matrix, imageTextureInfo.width, imageTextureInfo.height, 1);

  imageUniforms.u_matrix = matrix;

  imageMatrixStack.restore();
}

function update(time) {
  translations(time);
  render();
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
