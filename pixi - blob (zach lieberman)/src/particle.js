import Vec2 from "vec2";
import * as PIXI from "pixi.js";

export default class Particle {
  constructor(x, y) {
    this.graphic = new PIXI.Graphics();
    this.graphic.beginFill(0xe74c3c);
    this.graphic.drawCircle(0, 0, 4);
    this.graphic.endFill();

    this.pos = new Vec2();
    this.vel = new Vec2();
    this.frc = new Vec2();
    this.damping = 0.05;
    this.bFixed = false;
    this.setInitialCondition(x, y);
  }

  addDampingForce = () => {
    // the usual way to write this is  vel *= 0.99
    // basically, subtract some part of the velocity
    // damping is a force operating in the oposite direction of the
    // velocity vector

    this.frc.x = this.frc.x - this.vel.x * this.damping;
    this.frc.y = this.frc.y - this.vel.y * this.damping;
  };

  addAttractionForce = () => {};

  addRepulsionForce = (x, y, radius, scale) => {
    // ----------- (1) make a vector of where this position is:
    const posOfForce = new Vec2(x, y);

    // ----------- (2) calculate the difference & length

    const diff = this.pos.clone().subtract(posOfForce);
    const length = diff.length();

    // ----------- (3) check close enough

    let bAmCloseEnough = true;
    if (radius > 0) {
      if (length > radius) {
        bAmCloseEnough = false;
      }
    }

    // ----------- (4) if so, update force

    if (bAmCloseEnough == true) {
      const pct = 1 - length / radius; // stronger on the inside
      diff.normalize();
      this.frc.x = this.frc.x + diff.x * scale * pct;
      this.frc.y = this.frc.y + diff.y * scale * pct;
    }
  };
  addRepulsionForceParticle = (particle, radius, scale) => {
    // ----------- (1) make a vector of where this particle p is:

    const posOfForce = new Vec2(particle.pos.x, particle.pos.y);

    // ----------- (2) calculate the difference & length

    const diff = this.pos.clone().subtract(posOfForce);
    const length = diff.length();

    // ----------- (3) check close enough

    let bAmCloseEnough = true;
    if (radius > 0) {
      if (length > radius) {
        bAmCloseEnough = false;
      }
    }

    // ----------- (4) if so, update force

    if (bAmCloseEnough == true) {
      const pct = 1 - length / radius; // stronger on the inside
      diff.normalize();
      this.frc.x = this.frc.x + diff.x * scale * pct;
      this.frc.y = this.frc.y + diff.y * scale * pct;
      particle.frc.x = particle.frc.x - diff.x * scale * pct;
      particle.frc.y = particle.frc.y - diff.y * scale * pct;
    }
  };

  setInitialCondition = (x, y) => {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2();
  };

  addForce = (x, y) => {
    this.frc.add(new Vec2(x, y));
  };

  resetForce = () => {
    this.frc.set(0, 0);
  };
  update = () => {
    this.vel = this.vel.add(this.frc, true);
    this.pos = this.pos.add(this.vel, true);
  };

  draw = () => {
    this.graphic.x = this.pos.x;
    this.graphic.y = this.pos.y;
  };
}
