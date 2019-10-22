import { defaultFilterVertex } from "pixi.js";

class VerletPoint {
  constructor(x, y) {
    this.setPosition(x, y);
  }

  setPosition = (x, y) => {
    this.oldX = x;
    this.oldY = y;
    this.x = x;
    this.y = y;
  };
  // takes an object: {left,right,top,bottom}
  constrain = rect => {
    this.x = Math.max(rect.left, Math.min(rect.right, this.x));
    this.y = Math.max(rect.top, Math.min(rect.bottom, this.y));
  };

  setVelocityX = vx => {
    this.oldX = this.x - vx;
  };

  getVelocityX = () => {
    return this.x - this.oldX;
  };
  
  setVelocityY = vy => {
    this.oldY = this.y - vy;
  };

  getVelocityY = () => {
    return this.y - this.oldY;
  };

  update = () => {
    const tempX = this.x;
    const tempY = this.y;

    this.x += this.getVelocityX();
    this.y += this.getVelocityY();

    this.oldX = tempX;
    this.oldY = tempY;
  };
}

export default VerletPoint;
