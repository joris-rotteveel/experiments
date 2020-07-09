import { createProgramFromScripts, resizeCanvasToDisplaySize } from "./utils";
import "./index.css";

// https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

// setup GLSL program
const program = createProgramFromScripts(gl, [
  "vertex-shader-2d",
  "fragment-shader-2d",
]);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");

// lookup uniforms
var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
var colorLocation = gl.getUniformLocation(program, "u_color");
var translationLocation = gl.getUniformLocation(program, "u_translation");
var rotationLocation = gl.getUniformLocation(program, "u_rotation");
var scaleLocation = gl.getUniformLocation(program, "u_scale");

// Create a buffer to put three 2d clip space points in
const positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put geometry data into buffer
setGeometry(gl);
var translation = [0, 0];
var rotation = [0, 1];
var scale = [1, 1];
var color = [Math.random(), Math.random(), Math.random(), 1];

drawScene();
var angle = 0;
function updatePosition() {
  translation[0] = window.innerWidth / 2; //+ Math.cos(angle) * 100;
  translation[1] = window.innerHeight / 2; //+ Math.sin(angle) * 100;

  // rotation[0] = Math.cos(angle);
  // rotation[1] = Math.sin(angle);

  scale[0] = scale[1] = 1 + Math.cos(angle) * 0.5;
  drawScene();
  angle += 0.1;
}

function drawScene() {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // set the resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // set the color
  gl.uniform4fv(colorLocation, color);

  // Set the translation.
  gl.uniform2fv(translationLocation, translation);

  // Set the rotation.
  gl.uniform2fv(rotationLocation, rotation);

  // Set the scale.
  gl.uniform2fv(scaleLocation, scale);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;

  var count = 18; // 6 triangles in the 'F', 3 points per triangle
  gl.drawArrays(primitiveType, offset, count);
}

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0,
      0,
      30,
      0,
      0,
      150,
      0,
      150,
      30,
      0,
      30,
      150,

      // top rung
      30,
      0,
      100,
      0,
      30,
      30,
      30,
      30,
      100,
      0,
      100,
      30,

      // middle rung
      30,
      60,
      67,
      60,
      30,
      90,
      30,
      90,
      67,
      60,
      67,
      90,
    ]),
    gl.STATIC_DRAW
  );
}

const update = () => {
  updatePosition();
  console.log("y");
  window.requestAnimationFrame(update);
};

update();
