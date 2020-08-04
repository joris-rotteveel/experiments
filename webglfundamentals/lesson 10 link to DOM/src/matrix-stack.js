import { m4 } from "./m4";

export default class MatrixStack {
  constructor() {
    this.stack = [];

    // since the stack is empty this will put an initial matrix in it
    this.restore();
  }

  // Pops the top of the stack restoring the previously saved matrix
  restore = function () {
    this.stack.pop();
    // Never let the stack be totally empty
    if (this.stack.length < 1) {
      this.stack[0] = m4.identity();
    }
  };

  // Pushes a copy of the current matrix on the stack
  save = function () {
    this.stack.push(this.getCurrentMatrix());
  };
  // Gets a copy of the current matrix (top of the stack)
  getCurrentMatrix = function () {
    return this.stack[this.stack.length - 1].slice();
  };

  // Lets us set the current matrix
  setCurrentMatrix = function (m) {
    return (this.stack[this.stack.length - 1] = m);
  };
  // Translates the current matrix
  translate = function (x, y, z) {
    if (z === undefined) {
      z = 0;
    }
    var m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.translate(m, x, y, z));
  };

  // Rotates the current matrix around Z
  rotateZ = function (angleInRadians) {
    var m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.zRotate(m, angleInRadians));
  };

  // Scales the current matrix
  scale = function (x, y, z) {
    if (z === undefined) {
      z = 1;
    }
    var m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.scale(m, x, y, z));
  };
}
