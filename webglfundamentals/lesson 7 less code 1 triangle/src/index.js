import {
  resizeCanvasToDisplaySize,
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  setUniforms,
  createProgramFromScripts,
  createUniformSetters,
  createAttributeSetters,
} from "./utils";
import "./index.css";

var rand = function (min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + Math.random() * (max - min);
};

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

gl.enable(gl.DEPTH_TEST);

// a single triangle
var arrays = {
  position: { numComponents: 2, data: [0, -1, 1, 1, -1, 1] },
};
var bufferInfo = createBufferInfoFromArrays(gl, arrays);
// setup GLSL program
var program = createProgramFromScripts(gl, [
  "vertex-shader-3d",
  "fragment-shader-3d",
]);
var uniformSetters = createUniformSetters(gl, program);
var attribSetters = createAttributeSetters(gl, program);

var uniformsThatAreTheSameForAllObjects = {};
var uniformsThatAreComputedForEachObject = { u_color: [0.1, 0.51, 0.7, 1] };

var objects = [];
var numObjects = 300;
for (var ii = 0; ii < numObjects; ++ii) {
  objects.push({
    radius: rand(150),
    color: [0.5, 0.1, 1, 1],
    xRotation: rand(Math.PI * 2),
    yRotation: rand(Math.PI),
    materialUniforms: {},
  });
}

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
  objects.forEach(function (object) {
    // Compute a color for this object based on the time.

    object.color[0] = Math.cos(time);
    uniformsThatAreComputedForEachObject.u_color = object.color;

    // Set the uniforms we just computed
    setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);

    // Set the uniforms that are specific to the this object.
    setUniforms(uniformSetters, object.materialUniforms);

    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
  });

  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
