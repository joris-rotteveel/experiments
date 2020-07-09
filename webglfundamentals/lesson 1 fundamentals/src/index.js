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
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// look up uniform locations
const resolutionUniformLocation = gl.getUniformLocation(
  program,
  "u_resolution"
);
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Create a buffer to put three 2d clip space points in
const positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

resizeCanvasToDisplaySize(gl.canvas);

// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
const size = 2; // 2 components per iteration
const type = gl.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

// set the resolution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Setup a random rectangle
// This will write to positionBuffer because
// its the last thing we bound on the ARRAY_BUFFER
// bind point

const x = 10;
const y = 20;
const w = 1000;
const h = 40;

setRectangle(gl, x, y, w, h);
// Set a random color.
gl.uniform4f(
  colorUniformLocation,
  Math.random(),
  Math.random(),
  Math.random(),
  1
);

// Draw the rectangle.
// a rect has 2 triangles === 6 poins
const count = 6;
gl.drawArrays(gl.TRIANGLES, 0, count);

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}
