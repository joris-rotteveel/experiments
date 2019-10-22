import * as PIXI from "pixi.js";
import { createVector, p5 } from "./p5/p5";

export default class Pose extends PIXI.Container {
  constructor() {
    super();

    this.positions = {};

    var graphics = new PIXI.Graphics();

    // Set the fill color
    const fill = 0x000000;
    graphics.beginFill(fill, 0.1);

    // Draw a circle
    graphics.drawCircle(0, 0, this.radius);
    this.addChild(graphics);
  }

  setPose = ({ keypoints }) => {
    // center ofhead will be at the nose
    const nose = keypoints.filter(i => i.part === "nose")[0];
    if (nose) {
      this.positions.head = createVector(nose.position.x, nose.position.y);
    } else {
      this.positions.head = null;
    }
  };
  getPosition = key => {
    return this.positions[key];
  };

  update = () => {
    // this.position.set(this.pos.x, this.pos.y);
  };
}
