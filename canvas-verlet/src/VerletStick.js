import { defaultFilterVertex } from "pixi.js";

class VerletStick {
  constructor(pointA, pointB, length) {
    this.pointA = pointA;
    this.pointB = pointB;
    if (!length) {
      const dx = pointA.x - pointB.x;
      const dy = pointA.y - pointB.y;
       this.length = Math.sqrt(dx * dx + dy * dy);
       console.log(this.length) } else {
      this.length = length;
    }

    // this.length=100;
  }

  update = () => {
    const dx = this.pointB.x - this.pointA.x;
    const dy = this.pointB.y - this.pointA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const diff = this.length - dist;
    const offsetX = (diff * dx) / dist / 2;
    const offsetY = (diff * dy) / dist / 2;


    // set position!
    this.pointA.x -= offsetX;
    this.pointA.y -= offsetY;

    this.pointB.x += offsetX;
    this.pointB.y += offsetY;
  };
}

export default VerletStick;
