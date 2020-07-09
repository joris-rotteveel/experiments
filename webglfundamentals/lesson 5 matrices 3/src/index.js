import { createProgramFromScripts, resizeCanvasToDisplaySize } from "./utils";
import "./index.css";
import { m3 } from "./m3";

// https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html

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
var colorLocation = gl.getUniformLocation(program, "u_color");
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
// Create a buffer to put three 2d clip space points in
const positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put geometry data into buffer
setGeometry(gl);
var translation = [0, 0];

var scale = [1, 1];
var color = [Math.random(), Math.random(), Math.random(), 1];

drawScene();
var angle = 0;
function updatePosition() {
  translation[0] = window.innerWidth / 2;
  translation[1] = window.innerHeight / 2;

  scale[0] = scale[1] = 1 + Math.abs(Math.cos(angle) * 0.5);
  drawScene();
  angle += 0.01;
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

  // set the color
  gl.uniform4fv(colorLocation, color);

  // Compute the matrices
  var translationMatrix = m3.translation(translation[0], translation[1]);
  var rotationMatrix = m3.rotation(angle);
  var scaleMatrix = m3.scaling(scale[0], scale[1]);

  // Compute the matrices
  var projectionMatrix = m3.projection(
    gl.canvas.clientWidth,
    gl.canvas.clientHeight
  );
  // make a matrix that will move the origin of the 'F' to its center.
  var moveOriginMatrix = m3.translation(-50, -75);

  // Multiply the matrices.
  var matrix = m3.multiply(projectionMatrix, translationMatrix);
  matrix = m3.multiply(matrix, rotationMatrix);
  matrix = m3.multiply(matrix, scaleMatrix);
  matrix = m3.multiply(matrix, moveOriginMatrix);

  // Set the matrix.
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;
  offset = 0;
  var count = 18; // 6 triangles in the 'F', 3 points per triangle
  gl.drawArrays(primitiveType, offset, count);

  // Multiply the matrices.
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
  window.requestAnimationFrame(update);
};

update();
