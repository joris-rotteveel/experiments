import { m4 } from "./m4";
import { createBufferInfoFromArrays } from "./utils";
import MatrixStack from "./matrix-stack";

export default class Sprite {
  constructor(gl, { programInfo, texture }) {
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
}
