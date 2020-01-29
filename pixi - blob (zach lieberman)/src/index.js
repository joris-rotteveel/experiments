import "./index.css";
import * as PIXI from "pixi.js";
import Particle from "./particle";
import Spring from "./spring";

let mouseX = 0;
let mouseY = 0;

const TWO_PI = Math.PI * 2;
const particles = [];
const springs = [];

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: 0xffffff
});
const stage = app.stage;

const graphics = new PIXI.Graphics();
stage.addChild(graphics);

document.body.appendChild(app.view);

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
const updateForces = () => {
  // on every frame
  // we reset the forces
  // add in any forces on the particle
  // perfom damping and
  // then update
  for (let i = 0; i < particles.length; i++) {
    particles[i].resetForce();
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].addRepulsionForce(mouseX, mouseY, 200, 0.7);
    for (let j = 0; j < i; j++) {
      particles[i].addRepulsionForceParticle(particles[j], 50, 0.1);
    }
  }

  for (let i = 0; i < springs.length; i++) {
    springs[i].update();
  }
  for (let i = 0; i < particles.length; i++) {
    // particles[i].bounceOffWalls();
    particles[i].addDampingForce();
    particles[i].update();
  }
};

const draw = () => {
  // ofSetColor(0xffffff);
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
  }

  graphics.clear();
  for (let i = 0; i < springs.length; i++) {
    const spring = springs[i];
    const a = spring.particleA;
    const b = spring.particleB;
    graphics.moveTo(a.pos.x, a.pos.y);
    graphics.lineStyle(1, 0xff0000);
    graphics.lineTo(b.pos.x, b.pos.y);
  }
};
const update = delta => {
  updateForces();
  draw();
};

const createParticles = amount => {
  for (let i = 0; i < amount; i++) {
    const x = 500 + 500 * Math.cos((i / 200.0) * TWO_PI);
    const y = 500 + 500 * Math.sin((i / 200.0) * TWO_PI);

    const particle = new Particle(x, y);

    // stage.addChild(particle.graphic);

    particles.push(particle);
  }

  for (let i = 0; i < particles.length; i++) {
    const particleA = particles[i];
    const particleB = particles[(i + 1) % particles.length];
    const spring = new Spring(particleA, particleB);
    spring.distance = 10;
    spring.springiness = 0.2;
    springs.push(spring);
  }
};

const setup = () => {
  // Add the graphics to the stage

  createParticles(20);
  app.ticker.add(update);
};

setup();
