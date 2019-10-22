import "./index.css";
import * as PIXI from "pixi.js";
import Particle from "./Particle";
import { createVector, p5 } from "./p5/p5";

const G = 1;
const allParticles = [];
const attractors = [];
///A
const predefinedShapes = [
  { x: 331, y: 699 },
  { x: 356, y: 644 },
  { x: 380, y: 588 },
  { x: 406, y: 534 },
  { x: 426, y: 484 },
  { x: 454, y: 438 },
  { x: 474, y: 390 },
  { x: 491, y: 339 },
  { x: 540, y: 392 },
  { x: 562, y: 435 },
  { x: 581, y: 493 },
  { x: 594, y: 534 },
  { x: 609, y: 587 },
  { x: 628, y: 631 },
  { x: 646, y: 677 },
  { x: 654, y: 712 },
  { x: 420, y: 561 },
  { x: 464, y: 556 },
  { x: 513, y: 557 },
  { x: 562, y: 553 }
];
const gravity = createVector(0, 1);

// const centerPoint = new Particle({
//   mass: 100,
//   x: window.innerWidth / 2,
//   y: window.innerHeight / 2,
//   isStatic: true
// });
// centerPoint.update();

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: 0xffffff
});

const canvas = new PIXI.Graphics();

document.body.appendChild(app.view);

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const checkBounds = particle => {
  const minY = particle.radius;
  const maxY = window.innerHeight - particle.radius;
  const minX = particle.radius;
  const maxX = window.innerWidth - particle.radius;

  const bounceFriction = -1;

  if (particle.pos.x > maxX) {
    particle.pos.x = maxX;
    particle.velocity.x *= bounceFriction;
  } else if (particle.pos.x < minX) {
    particle.pos.x = minX;
    particle.velocity.x *= bounceFriction;
  }
  if (particle.pos.y > maxY) {
    particle.pos.y = maxY;
    particle.velocity.y *= bounceFriction;
  }
  if (particle.pos.y < minY) {
    particle.pos.y = minY + 1;
    particle.velocity.y *= bounceFriction;
  }
};

const move = () => {
  canvas.lineStyle(1,0x000000,0.1);
  for (let i = 0; i < allParticles.length; i++) {
    const particleA = allParticles[i];
    canvas.moveTo(particleA.pos.x, particleA.pos.y);
    for (let j = 0; j < allParticles.length; j++) {
      const particleB = allParticles[j];
      if (particleA !== particleB) {
        const force = particleB.attract(particleA);
        particleA.applyForce(force);
      }
    }
    for (let index = 0; index < attractors.length; index++) {
      const attractor = attractors[index];
      // const attractionForce = attractor.attract(particleA);
      // particleA.applyForce(attractionForce);
    }
    checkBounds(particleA);
    particleA.update();
    canvas.lineTo(particleA.pos.x, particleA.pos.y);
  }
};

const update = delta => {
  // centerPoint.update();
  move();
};

const setup = () => {
  const container = new PIXI.Container();
  container.addChild(canvas);

  app.stage.addChild(container);
  for (let index = 0; index < 12; index++) {
    const mass = 10 + Math.random() * 10;
    const particle = new Particle({
      x: (Math.random() * window.innerWidth) / 2,
      y: (Math.random() * window.innerHeight) / 2,
      mass
    });
    container.addChild(particle);
    allParticles.push(particle);
  }
  for (let index = 0; index < predefinedShapes.length; index++) {
    const { x, y } = predefinedShapes[index];
    const centerPoint = new Particle({
      mass: 55,
      x: x,
      y: y,
      isStatic: true
    });
    centerPoint.update();
    // container.addChild(centerPoint);

    attractors.push(centerPoint);
  }
  // container.addChild(centerPoint);
  app.ticker.add(update);

  window.addEventListener("mousemove", e => {
    // centerPoint.pos.x=e.clientX;
    // centerPoint.pos.y=e.clientY;
  });
};

setup();
