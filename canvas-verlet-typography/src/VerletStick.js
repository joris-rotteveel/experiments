import { defaultFilterVertex } from "pixi.js";

class VerletStick {
  constructor(pointA, pointB, length, isStatic) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.angle = 0;
    if (!length) {
      const dx = pointA.x - pointB.x;
      const dy = pointA.y - pointB.y;
      this.length = Math.sqrt(dx * dx + dy * dy);
    } else {
      this.length = length;
    }

    this.isStatic = isStatic;
    // pointA.setStatic(isStatic);
  }

  update = () => {
    let division = 2;

    const dx = this.pointB.x - this.pointA.x;
    const dy = this.pointB.y - this.pointA.y;

    const angle = Math.atan2(dy, dx);

    this.angle = angle;

    if (this.isStatic) {
      this.pointB.x = this.pointA.x + Math.cos(angle) * this.length;
      this.pointB.y = this.pointA.y + Math.sin(angle) * this.length;
    } else {
      const dist = Math.sqrt(dx * dx + dy * dy);
      const diff = this.length - dist;
      const offsetX = (Math.cos(angle) * diff) / division;
      const offsetY = (Math.sin(angle) * diff) / division;
      this.pointA.x -= offsetX;
      this.pointA.y -= offsetY;
      this.pointB.x += offsetX;
      this.pointB.y += offsetY;
    }
  };
}

export default VerletStick;
