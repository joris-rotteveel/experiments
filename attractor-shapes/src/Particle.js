import * as PIXI from "pixi.js";
import { createVector, p5 } from "./p5/p5";

export default class Particle extends PIXI.Container {
  constructor({ mass, x, y, isStatic }) {
    super();
    this.mass = mass;
    this.radius = this.mass;
    this.mass = isStatic ? 90 : this.mass;
    this.pos = createVector(x, y);
    this.isStatic = isStatic;

    // console.log( this.pos)
    this.velocity = isStatic
      ? createVector()
      : createVector(4+Math.random()*2, Math.random()*2);
    this.acceleration = createVector(0, 0);

    this.position.set(this.pos.x, this.pos.y);
    var graphics = new PIXI.Graphics();
    this.position.set(this.pos.x, this.pos.y);

    // Set the fill color
    const fill = isStatic ? 0xe74c3c : 0x000000;
    graphics.beginFill(fill, 0.1);

    // Draw a circle
    graphics.drawCircle(0, 0, this.radius);
    this.addChild(graphics);
  }

  repel = particle => {
    const G = 1;
    const force = p5.Vector.sub(this.pos, particle.pos);
    const rawDistance= force.mag();
    const distance = Math.min(10000000000, Math.max(1, force.mag()));
    force.normalize();
    const strength = (particle.mass * this.mass) / (distance * distance);
    force.mult(strength);



    const minDist = this.radius + particle.radius;

    if (rawDistance < minDist) {
      const dx = particle.pos.x - this.pos.x;
      const dy = particle.pos.y - this.pos.y;
      const angle = Math.atan2(dy, dx);

      //prevent overlap
      // particle.pos.x = this.pos.x + Math.cos(angle) * minDist;
      // particle.pos.y = this.pos.y + Math.sin(angle) * minDist;
      //bounce of this particle;
      // particle.velocity.x *= Math.cos(angle) //* 0.6;
      // particle.velocity.y = Math.sin(angle) 
    }


    return force;
  };

  attract = particle => {
    const force = p5.Vector.sub(this.pos, particle.pos);
    const rawDistance = force.mag();
    const distance = Math.min(25, Math.max(5, rawDistance));
    force.normalize();
    const strength = (particle.mass * this.mass) / (distance * distance);
    force.mult(strength);

    const minDist = this.radius + particle.radius;
    if (rawDistance < minDist) {
      const dx = particle.pos.x - this.pos.x;
      const dy = particle.pos.y - this.pos.y;
      const angle = Math.atan2(dy, dx);

      // //prevent overlap
      // particle.pos.x = this.pos.x + Math.cos(angle) * minDist;
      // particle.pos.y = this.pos.y + Math.sin(angle) * minDist;
      // //bounce of this particle;
      // particle.velocity.x = Math.cos(angle) * 0.6;
      // particle.velocity.y = Math.sin(angle) * 0.6;
    }

    return force;
  };
  applyForce = force => {
    const f = p5.Vector.div(force, this.radius);
    this.acceleration.add(f);
  };

  update = () => {
    this.velocity.add(this.acceleration);
    // this.velocity.limit(this.maxspeed);
    this.pos.add(this.velocity);
    this.acceleration.mult(0);
    this.position.set(this.pos.x, this.pos.y);
  };
}
