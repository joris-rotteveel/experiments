import { m4 } from "./m4";
import { createBufferInfoFromArrays } from "./utils";
import MatrixStack from "./matrix-stack";

export const mapRange = (current, fromMin, fromMax, toMin, toMax) => {
  return toMin + ((toMax - toMin) * (current - fromMin)) / (fromMax - fromMin);
};

export default class Sprite {
  constructor(gl, { programInfo, texture }) {
    this.x = 0;
    this.y = 0;
    //rads
    this.rotation = 0;
    // pixels;
    this.anchor = { x: 0, y: 0 };

    this.topLeft = { x: 0, y: 0 };
    this.bottomLeft = { x: 0, y: 1 };
    this.topRight = { x: 1, y: 0 };
    this.bottomRight = { x: 1, y: 1 };
    this.gl = gl;
    this.stack = [];
    const standardBuffers = {
      position: {
        numComponents: 2,
        // a single quad
        data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
      },
      texcoord: {
        numComponents: 2,
        data: [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1],
      },
    };

    this.programInfo = programInfo;
    this.texture = texture;
    this.bufferInfo = createBufferInfoFromArrays(gl, standardBuffers);
    this.uniforms = {
      u_matrix: m4.identity(),
      u_textureMatrix: m4.identity(),
    };
    this.matrix = new MatrixStack();

    this.setVertices(
      { x: 0, y: 0 },
      { x: 0, y: texture.height },
      { x: texture.width, y: 0 },
      { x: texture.width, y: texture.height }
    );
  }

  getClipX = (x) => {
    const clipSpace = x / this.gl.canvas.width;
    //clipspace compare to 0 to 1 = 0 to srcWidth
    const multiplier = this.gl.canvas.width / this.texture.width;
    //we need to calc it into pixels
    return clipSpace * multiplier;
  };

  getClipY = (y) => {
    const clipSpace = y / this.gl.canvas.height;
    //clipspace compare to 0 to 1 = 0 to srcWidth
    const multiplier = this.gl.canvas.height / this.texture.height;
    //we need to calc it into pixels
    return clipSpace * multiplier;
  };
  update = () => {
    // update imageUniforms
    this.matrix.save();
    // this this.matrix will translate our quad to dstX, dstY
    this.matrix.translate(this.x, this.y);
    //rotate it on the left top corner
    this.matrix.rotateZ(this.rotation);
    //offset it so we rotate from anchor of image
    this.matrix.translate(this.anchor.x, this.anchor.y);

    // let's set the image in screen space
    var screenMatrix = m4.orthographic(
      0,
      this.gl.canvas.width,
      this.gl.canvas.height,
      0,
      -1,
      1
    );

    // this matrix moves the origin to the one represented by
    // the current matrix stack.
    screenMatrix = m4.multiply(screenMatrix, this.matrix.getCurrentMatrix());

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    screenMatrix = m4.scale(
      screenMatrix,
      this.texture.width,
      this.texture.height,
      1
    );

    this.uniforms.u_matrix = screenMatrix;
  };

  getVertices = () => this.verticesScreen;

  setVertices = (topLeft, bottomLeft, topRight, bottomRight) => {
    //coords come in as screen space
    this.verticesScreen = {
      topLeft,
      bottomLeft,
      topRight,
      bottomRight,
    };

    this.topLeft.x = this.getClipX(topLeft.x);
    this.topLeft.y = this.getClipY(topLeft.y);

    this.bottomLeft.x = this.getClipX(bottomLeft.x);
    this.bottomLeft.y = this.getClipY(bottomLeft.y);

    this.topRight.x = this.getClipX(topRight.x);
    this.topRight.y = this.getClipY(topRight.y);
    this.bottomRight.x = this.getClipX(bottomRight.x);
    this.bottomRight.y = this.getClipY(bottomRight.y);
  };

  render = () => {
    this.matrix.restore();
    this.gl.bindBuffer(
      this.gl.ARRAY_BUFFER,
      this.bufferInfo.attribs.a_position.buffer
    );
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        this.topLeft.x,
        this.topLeft.y,
        this.bottomLeft.x,
        this.bottomLeft.y,
        this.topRight.x,
        this.topRight.y,
        this.topRight.x,
        this.topRight.y,
        this.bottomLeft.x,
        this.bottomLeft.y,
        this.bottomRight.x,
        this.bottomRight.y,
      ]),
      this.gl.STATIC_DRAW
    );
  };
}
