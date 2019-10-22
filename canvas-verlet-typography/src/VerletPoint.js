import { defaultFilterVertex } from "pixi.js";

class VerletPoint {
  constructor(x, y, id) {
    this.setPosition(x, y);
    this.vx = this.vy = 0;
    this.id = id;
  }

  setStatic = val => {
    this.isStatic = val;
  };

  setPosition = (x, y) => {
    this.oldX = x;
    this.oldY = y;
    this.x = x;
    this.y = y;
  };
  // takes an object: {left,right,top,bottom}
  constrain = rect => {
    if (this.x < rect.left || this.x > rect.right) {
      // this.vx *= -1;
    }
    if (this.y < rect.top || this.y > rect.bottom) {
      // this.vy *= -1;
    }
    this.x = Math.max(rect.left, Math.min(rect.right, this.x));
    this.y = Math.max(rect.top, Math.min(rect.bottom, this.y));
  };

  update = () => {
    if (this.isStatic) return;
    this.x += this.vx;
    this.y += this.vy;
  };
}

export default VerletPoint;
