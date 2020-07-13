import {
  resizeCanvasToDisplaySize,
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  setUniforms,
  createProgramFromScripts,
  createUniformSetters,
  createAttributeSetters,
} from "./utils";

import mountain from "./assets/mountain.jpg";
import "./index.css";
import { loadImageAndCreateTextureInfo } from "./webgl";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

gl.enable(gl.DEPTH_TEST);

// a single quad

var arrays = {
  position: {
    numComponents: 2,
    data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
  },
  texcoord: {
    numComponents: 2,
    data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
  },
};

var textureInfos = [loadImageAndCreateTextureInfo(mountain, gl)];

var bufferInfo = createBufferInfoFromArrays(gl, arrays);
// setup GLSL program
var program = createProgramFromScripts(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);
var uniformSetters = createUniformSetters(gl, program);
var attribSetters = createAttributeSetters(gl, program);

var uniformsThatAreTheSameForAllObjects = {};
var uniformsThatAreComputedForEachObject = {};

var imagesData = [];
imagesData.push({
  someVar: 1,
  textureInfo: textureInfos[0],
  materialUniforms: {
    u_color: [0.15, 0.1, 1, 1],
    u_texture: textureInfos[0].texture,
  },
});

// Draw the scene.
function drawScene(time) {
  time = time * 0.001;

  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  // Setup all the needed attributes.
  setBuffersAndAttributes(gl, attribSetters, bufferInfo);

  // Set the uniforms that are the same for all objects.
  setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects);

  // Draw objects
  imagesData.forEach(function (imageData) {
    // Compute a color for this object based on the time.

    imageData.someVar = Math.cos(time);
    // uniformsThatAreComputedForEachObject.u_color = object.color;

    // Set the uniforms we just computed
    setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);

    // Set the uniforms that are specific to the this object.
    setUniforms(uniformSetters, imageData.materialUniforms);

    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
  });

  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
