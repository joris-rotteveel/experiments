import gsap from "gsap";
import { m4 } from "./m4";
import { createBufferInfoFromArrays } from "./utils";
import MatrixStack from "./matrix-stack";

export const mapRange = (current, fromMin, fromMax, toMin, toMax) => {
  return toMin + ((toMax - toMin) * (current - fromMin)) / (fromMax - fromMin);
};

export default class Sprite {
  constructor(gl, { programInfo, texture }) {
    this.x = 0;
    this.y = 100;

    this.tl = { x: 0, y: 0 };
    this.bl = { x: 0, y: 1 };
    this.tr = { x: 1, y: 0 };
    this.br = { x: 1, y: 1 };
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
  }

  updateVertices = (vertices) => {
    //coords come in as screen space

    const getClipX = (x) => {
      const clipSpace = (x - this.x) / this.gl.canvas.width;
      //clipspace compare to 0 to 1 = 0 to srcWidth
      const multiplier = this.gl.canvas.width / this.texture.width;
      //we need to calc it into pixels
      return clipSpace * multiplier;
    };

    const getClipY = (y) => {
      const clipSpace = (y - this.y) / this.gl.canvas.height;
      //clipspace compare to 0 to 1 = 0 to srcWidth
      const multiplier = this.gl.canvas.height / this.texture.height;
      //we need to calc it into pixels
      return clipSpace * multiplier;
    };

    this.tl.x = getClipX(vertices[0]);
    this.tl.y = getClipY(vertices[1]);

    this.bl.x = getClipX(vertices[2]);
    this.bl.y = getClipY(vertices[3]);

    this.tr.x = getClipX(vertices[4]);
    this.tr.y = getClipY(vertices[5]);
    this.br.x = getClipX(vertices[10]);
    this.br.y = getClipY(vertices[11]);
  };

  drawVertices = () => {
    this.gl.bindBuffer(
      this.gl.ARRAY_BUFFER,
      this.bufferInfo.attribs.a_position.buffer
    );
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        this.tl.x,
        this.tl.y,
        this.bl.x,
        this.bl.y,
        this.tr.x,
        this.tr.y,
        this.tr.x,
        this.tr.y,
        this.bl.x,
        this.bl.y,
        this.br.x,
        this.br.y,
      ]),
      this.gl.STATIC_DRAW
    );
  };

  fullScreen = (val) => {
    // const direction = val ? 1 : 0;
    // var srcWidth = this.texture.width; // * drawInfo.width;
    // var srcHeight = this.texture.height; // * drawInfo.height;
    // const extraWidth =
    //   ((this.gl.canvas.width - srcWidth) / srcWidth) * direction;
    // const extraHeight =
    //   ((this.gl.canvas.height - srcHeight) / srcHeight) * direction;
    // const offsetX = (this.x / srcWidth) * direction;
    // const offsetY = (this.y / srcHeight) * direction;
    // gsap.to(this.tl, {
    //   delay: Math.random() * 0.5,
    //   duration: Math.random() * 0.5,
    //   x: 0 - offsetX,
    //   y: 0 - offsetY,
    // });
    // gsap.to(this.bl, {
    //   delay: Math.random() * 0.5,
    //   duration: Math.random() * 0.5,
    //   x: 0 - offsetX,
    //   y: 1 + extraHeight - offsetY,
    // });
    // gsap.to(this.tr, {
    //   delay: Math.random() * 0.5,
    //   duration: Math.random() * 0.5,
    //   x: 1 + extraWidth - offsetX,
    //   y: 0 - offsetY,
    // });
    // gsap.to(this.br, {
    //   delay: Math.random() * 0.5,
    //   duration: Math.random() * 0.5,
    //   x: 1 + extraWidth - offsetX,
    //   y: 1 + extraHeight - offsetY,
    // });
  };
}
