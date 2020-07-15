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
import { m4 } from "./m4";
import MatrixStack from "./matrix-stack";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

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

var uniformsThatAreComputedForEachObject = {
  // we need to look at chapter 6 to see how we can use these to get things into screenspace
  u_matrix: m4.identity(),
  u_textureMatrix: m4.identity(),
};

const mountainUniforms = {
  u_matrix: m4.identity(),
  u_textureMatrix: m4.identity(),
};

const fieldUniforms = {
  u_matrix: m4.identity(),
  u_textureMatrix: m4.identity(),
};


var imagesData = [];
imagesData.push({
  someVar: 1,
  textureInfo: textureInfos[0],
  matrixStack: new MatrixStack(),
  materialUniforms: {},
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

    const { matrixStack, textureInfo } = imageData;
    const destX = gl.canvas.width / 2 + (Math.cos(time) * gl.canvas.width) / 2;
    const destY = gl.canvas.height / 2;

    matrixStack.save();

    // this matrix will translate our quad to dstX, dstY
    matrixStack.translate(destX, destY);
    //rotate it on the left top corner
    matrixStack.rotateZ(time);
    //offset it so we rotate from center of image
    matrixStack.translate(textureInfo.width / -2, textureInfo.height / -2);

    // let's set the image in screen space
    var matrix = m4.orthographic(
      0,
      gl.canvas.width,
      gl.canvas.height,
      0,
      -1,
      1
    );

    // this matrix moves the origin to the one represented by
    // the current matrix stack.
    matrix = m4.multiply(matrix, matrixStack.getCurrentMatrix());

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = m4.scale(matrix, textureInfo.width, textureInfo.height, 1);

    // const matrix = uniformsThatAreComputedForEachObject.u_matrix;
    uniformsThatAreComputedForEachObject.u_matrix = matrix;

    // Set the uniforms we just computed
    setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);

    // Set the uniforms that are specific to the this object.
    setUniforms(uniformSetters, imageData.materialUniforms);

    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);

    matrixStack.restore();
  });

  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
