import * as PIXI from "pixi.js";
import { createVector, p5 } from "./p5/p5";

export default class Particle extends PIXI.Container {
  constructor({ mass, x, y, isStatic }) {
    super();
    this.mass = mass;
    this.radius = mass;
    this.pos = createVector(x, y);
    this.isStatic = isStatic;
    
    // console.log( this.pos)
    // this.velocity = createVector(Math.random() * 10 - 5, Math.random());

    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 5;
    // this.acceleration = createVector(0, 0);
    this.position.set(this.pos.x, this.pos.y);
    var graphics = new PIXI.Graphics();
    this.position.set(this.pos.x, this.pos.y);

    // Set the fill color
    const fill = isStatic ? 0xe74c3c : 0xff00ff;
    graphics.beginFill(fill, 0.5); // Red

    // Draw a circle
    graphics.drawCircle(0, 0, this.radius);
    this.addChild(graphics);
  }

  applyForce = force => {
    // const f = p5.Vector.div(force, this.radius);
    // this.acceleration.add(force);
  };

  move = () => {
    // this.position.set(this.pos.x, this.pos.y);
  };
}
