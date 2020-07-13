import gsap from "gsap";
import { createProgramFromScripts, resizeCanvasToDisplaySize } from "./utils";
import "./index.css";
import mountain from "./assets/mountain.jpg";

import { m4 } from "./m4";

// https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html
let isFullScreen = false;
document.addEventListener("mousedown", onMouseDown);

const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl");

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
    console.log(textureInfo.width);
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  });
  img.src = url;

  return textureInfo;
}

var textureInfos = [
  loadImageAndCreateTextureInfo(mountain),
  // loadImageAndCreateTextureInfo(street),
  // loadImageAndCreateTextureInfo(laptop),
];

var drawInfos = [];
var numToDraw = 1;

for (var ii = 0; ii < numToDraw; ++ii) {
  const tl = { x: 0, y: 0 };
  const bl = { x: 0, y: 1 };
  const tr = { x: 1, y: 0 };
  const br = { x: 1, y: 1 };
  var drawInfo = {
    speed: 150, //50 + 150 * Math.random(),
    x: 100, //Math.random() * gl.canvas.width,
    y: 100, // Math.random() * gl.canvas.height,
    dx: 1, //Math.random() > 0.5 ? -1 : 1,
    dy: 1, // Math.random() > 0.5 ? -1 : 1,
    xScale: 1,
    yScale: 1,
    offX: 0,
    offY: 0,
    rotation: 0, // Math.random() * Math.PI * 2,
    deltaRotation: -1, //(0.5 + Math.random() * 0.5) * (Math.random() > 0.5 ? -1 : 1),
    width: 1,
    height: 1,
    textureInfo: textureInfos[(Math.random() * textureInfos.length) | 0],
    vertices: { tl, bl, tr, br },
    verticesInitial: { tl, bl, tr, br },
  };
  drawInfos.push(drawInfo);
}
function onMouseDown() {
  isFullScreen = !isFullScreen;
  animate(isFullScreen);
}
function animate(expand) {
  const direction = expand ? 1 : 0;
  const drawInfo = drawInfos[0];
  const { vertices, x, y } = drawInfo;

  var srcWidth = drawInfo.textureInfo.width * drawInfo.width;
  var srcHeight = drawInfo.textureInfo.height * drawInfo.height;

  const extraWidth = ((gl.canvas.width - srcWidth) / srcWidth) * direction;
  const extraHeight = ((gl.canvas.height - srcHeight) / srcHeight) * direction;
  const offsetX = (x / srcWidth) * direction;
  const offsetY = (y / srcHeight) * direction;

  gsap.to(vertices.tl, {
    delay: Math.random() * 0.5,
    duration: Math.random() * 0.5,
    x: 0 - offsetX,
    y: 0 - offsetY,
  });
  gsap.to(vertices.bl, {
    delay: Math.random() * 0.5,
    duration: Math.random() * 0.5,
    x: 0 - offsetX,
    y: 1 + extraHeight - offsetY,
  });
  gsap.to(vertices.tr, {
    delay: Math.random() * 0.5,
    duration: Math.random() * 0.5,
    x: 1 + extraWidth - offsetX,
    y: 0 - offsetY,
  });
  gsap.to(vertices.br, {
    delay: Math.random() * 0.5,
    duration: Math.random() * 0.5,
    x: 1 + extraWidth - offsetX,
    y: 1 + extraHeight - offsetY,
  });
  // const tl = { x: 0 - offsetX, y: 0-offsetY };
  // const bl = { x: 0 - offsetX, y: 1 + extraHeight-offsetY };
  // const tr = { x: 1 + extraWidth - offsetX, y: 0-offsetY };
  // const br = { x: 1 + extraWidth - offsetX, y: 1 + extraHeight -offsetY};
}

function update(deltaTime) {
  if (isFullScreen) return;
  drawInfos.forEach(function (drawInfo) {
    drawInfo.x += drawInfo.dx * drawInfo.speed * deltaTime;
    drawInfo.y += drawInfo.dy * drawInfo.speed * deltaTime;
    if (drawInfo.x < 0) {
      drawInfo.dx = 1;
    }
    if (drawInfo.x + drawInfo.textureInfo.width >= gl.canvas.width) {
      drawInfo.dx = -1;
    }
    if (drawInfo.y < 0) {
      drawInfo.dy = 1;
    }
    if (drawInfo.y + drawInfo.textureInfo.height >= gl.canvas.height) {
      drawInfo.dy = -1;
    }
    drawInfo.rotation += drawInfo.deltaRotation * deltaTime;
  });
}

function draw() {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

  drawInfos.forEach(function (drawInfo) {
    var dstX = drawInfo.x;
    var dstY = drawInfo.y;
    var dstWidth = drawInfo.textureInfo.width * drawInfo.xScale;
    var dstHeight = drawInfo.textureInfo.height * drawInfo.yScale;

    var srcX = 0; //drawInfo.textureInfo.width * drawInfo.offX;
    var srcY = 0; // drawInfo.textureInfo.height * drawInfo.offY;
    var srcWidth = drawInfo.textureInfo.width * drawInfo.width;
    var srcHeight = drawInfo.textureInfo.height * drawInfo.height;

    drawImage(
      drawInfo.vertices,
      drawInfo.textureInfo.texture,
      drawInfo.textureInfo.width,
      drawInfo.textureInfo.height,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      dstX,
      dstY,
      dstWidth,
      dstHeight,
      drawInfo.rotation
    );
  });
}

var then = 0;
function render(time) {
  var now = time * 0.001;
  var deltaTime = Math.min(0.1, now - then);
  then = now;

  update(deltaTime);
  draw();

  requestAnimationFrame(render);
}

// Unlike images, textures do not have a width and height associated
// with them so we'll pass in the width and height of the texture
function drawImage(
  vertices,
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
  dstHeight,
  srcRotation
) {
  if (dstX === undefined) {
    dstX = srcX;
    srcX = 0;
  }
  if (dstY === undefined) {
    dstY = srcY;
    srcY = 0;
  }
  if (srcWidth === undefined) {
    srcWidth = texWidth;
  }
  if (srcHeight === undefined) {
    srcHeight = texHeight;
  }
  if (dstWidth === undefined) {
    dstWidth = srcWidth;
    srcWidth = texWidth;
  }
  if (dstHeight === undefined) {
    dstHeight = srcHeight;
    srcHeight = texHeight;
  }
  if (srcRotation === undefined) {
    srcRotation = 0;
  }
  gl.bindTexture(gl.TEXTURE_2D, tex);

  // Tell WebGL to use our shader program pair
  gl.useProgram(program);

  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // the image is currently at a position, other than 0,0.
  // caclulate it the quads position in clip space to align it to 0,0 screen coords
  // this new coord will set the image to 0,0 and make it full widtth and height of the screen
  // const extraWidth = (gl.canvas.width - srcWidth) / srcWidth;
  // const extraHeight = (gl.canvas.height - srcHeight) / srcHeight;
  // const offsetX = dstX / srcWidth;
  // const offsetY = dstY / srcHeight;

  // const tl = { x: 0 - offsetX, y: 0-offsetY };
  // const bl = { x: 0 - offsetX, y: 1 + extraHeight-offsetY };
  // const tr = { x: 1 + extraWidth - offsetX, y: 0-offsetY };
  // const br = { x: 1 + extraWidth - offsetX, y: 1 + extraHeight -offsetY};
  const { tl, bl, br, tr } = vertices;
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
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexPositions),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  // this matrix will convert from pixels to clip space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // this matrix will translate our quad to dstX, dstY
  matrix = m4.translate(matrix, dstX, dstY, 0);

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // just like a 2d projection matrix except in texture space (0 to 1)
  // instead of clip space. This matrix puts us in pixel space.
  var texMatrix = m4.scaling(1 / texWidth, 1 / texHeight, 1);

  // We need to pick a place to rotate around
  // We'll move to the middle, rotate, then move back
  texMatrix = m4.translate(texMatrix, texWidth * 0.5, texHeight * 0.5, 0);
  texMatrix = m4.zRotate(texMatrix, srcRotation);
  texMatrix = m4.translate(texMatrix, texWidth * -0.5, texHeight * -0.5, 0);

  // because were in pixel space
  // the scale and translation are now in pixels
  texMatrix = m4.translate(texMatrix, srcX, srcY, 0);
  texMatrix = m4.scale(texMatrix, srcWidth, srcHeight, 1);

  // Set the texture matrix.
  gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0);

  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

requestAnimationFrame(render);
