import { createProgramFromScripts, resizeCanvasToDisplaySize } from "./utils";
import "./index.css";
import mountain from "./assets/mountain.jpg";
import street from "./assets/street.jpg";
import laptop from "./assets/laptop.jpg";
import { m4 } from "./m4";
import MatrixStack from "./matrix-stack";

// https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");
var matrixStack = new MatrixStack();

// setup GLSL program
const program = createProgramFromScripts(gl, [
  "vertex-shader-2d",
  "fragment-shader-2d",
]);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");
var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

// lookup uniforms
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
var textureMatrixLocation = gl.getUniformLocation(program, "u_textureMatrix");
var textureLocation = gl.getUniformLocation(program, "u_texture");
// Create a buffer to put three 2d clip space points in
// Create a buffer.
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put a unit quad in the buffer
var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

/// Create a buffer for texture coords
var texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

// Put texcoords in the buffer
var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImageAndCreateTextureInfo(url) {
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  // let's assume all images are not a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  var textureInfo = {
    width: 1, // we don't know the size until it loads
    height: 1,
    texture: tex,
  };
  var img = new Image();
  img.addEventListener("load", function () {
    textureInfo.width = img.width;
    textureInfo.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  });
  img.src = url;

  return textureInfo;
}

var textureInfo = loadImageAndCreateTextureInfo(mountain);

function draw(time) {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

  matrixStack.save();
  matrixStack.translate(gl.canvas.width / 2, gl.canvas.height / 2);
  matrixStack.rotateZ(time);
  matrixStack.translate(textureInfo.width / -2, textureInfo.height / -2);

  drawImage(textureInfo.texture, textureInfo.width, textureInfo.height, 0, 0);

  matrixStack.restore();
}

var then = 0;
function render(time) {
  time *= 0.001;
  var now = time;
  var deltaTime = Math.min(0.1, now - then);
  then = now;

  draw(time);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Unlike images, textures do not have a width and height associated
// with them so we'll pass in the width and height of the texture
function drawImage(
  tex,
  texWidth,
  texHeight,
  srcX,
  srcY,
  srcWidth,
  srcHeight,
  dstX,
  dstY,
  dstWidth,
  dstHeight
) {
  if (dstX === undefined) {
    dstX = srcX;
  }
  if (dstY === undefined) {
    dstY = srcY;
  }
  if (srcWidth === undefined) {
    srcWidth = texWidth;
  }
  if (srcHeight === undefined) {
    srcHeight = texHeight;
  }
  if (dstWidth === undefined) {
    dstWidth = srcWidth;
  }
  if (dstHeight === undefined) {
    dstHeight = srcHeight;
  }

  gl.bindTexture(gl.TEXTURE_2D, tex);

  // Tell WebGL to use our shader program pair
  gl.useProgram(program);

  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  // this matrix will convert from pixels to clip space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // this matrix moves the origin to the one represented by
  // the current matrix stack.
  matrix = m4.multiply(matrix, matrixStack.getCurrentMatrix());

  // this matrix will translate our quad to dstX, dstY
  matrix = m4.translate(matrix, dstX, dstY, 0);

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // Because texture coordinates go from 0 to 1
  // and because our texture coordinates are already a unit quad
  // we can select an area of the texture by scaling the unit quad
  // down
  var texMatrix = m4.translation(srcX / texWidth, srcY / texHeight, 0);
  texMatrix = m4.scale(
    texMatrix,
    srcWidth / texWidth,
    srcHeight / texHeight,
    1
  );

  // Set the texture matrix.
  gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0);

  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
