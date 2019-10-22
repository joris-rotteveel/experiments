import "./index.css";
import * as PIXI from "pixi.js";
import Particle from "./Particle";
import { createVector, p5 } from "./p5/p5";

const allParticles = [];
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
const gravity = createVector(0, 0.2);

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  clearBeforeRender:false
});


app.renderer.clearBeforeRender=false;
app.renderer.preserveDrawingBuffer=true;
document.body.appendChild(app.view);

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const checkBounds = ball => {
  const minY = ball.radius;
  const maxY = window.innerHeight - ball.radius;
  const minX = ball.radius;
  const maxX = window.innerWidth - ball.radius;

  const bounceFriction = -1;

  if (ball.x > maxX) {
    ball.x = maxX;
    ball.vx *= bounceFriction;
  } else if (ball.x < minX) {
    ball.x = minX;
    ball.vx *= bounceFriction;
  }
  if (ball.y > maxY) {
    ball.y = maxY;
    ball.vy *= bounceFriction;
  }
  if (ball.y < minY) {
    ball.y = minY;
    ball.vy *= bounceFriction;
  }
};

const checkParticles = b1 => {
  for (var i = 0; i < allParticles.length; i++) {
    var b2 = allParticles[i];
    if (b1.position.x != b2.position.x && b1.position.y != b2.position.y) {
      //quick check for potential collisions using AABBs
      if (
        b1.position.x + b1.radius + b2.radius > b2.position.x &&
        b1.position.x < b2.position.x + b1.radius + b2.radius &&
        b1.position.y + b1.radius + b2.radius > b2.position.y &&
        b1.position.y < b2.position.y + b1.radius + b2.radius
      ) {
        //pythagoras
        var distX = b1.position.x - b2.position.x;
        var distY = b1.position.y - b2.position.y;
        var d = Math.sqrt(distX * distX + distY * distY);

        //checking circle vs circle collision
        if (d < b1.radius + b2.radius) {
          var nx = (b2.position.x - b1.position.x) / d;
          var ny = (b2.position.y - b1.position.y) / d;
          var p =
            (2 * (b1.vx * nx + b1.vy * ny - b2.vx * nx - b2.vy * ny)) /
            (b1.mass + b2.mass);

          // calulating the point of collision
          var colPointX =
            (b1.position.x * b2.radius + b2.position.x * b1.radius) /
            (b1.radius + b2.radius);
          var colPointY =
            (b1.position.y * b2.radius + b2.position.y * b1.radius) /
            (b1.radius + b2.radius);

          //stoping overlap
          if (!b1.isStatic) {
            b1.position.x =
              colPointX + (b1.radius * (b1.position.x - b2.position.x)) / d;
            b1.position.y =
              colPointY + (b1.radius * (b1.position.y - b2.position.y)) / d;
          }
          if (!b2.isStatic) {
            b2.position.x =
              colPointX + (b2.radius * (b2.position.x - b1.position.x)) / d;
            b2.position.y =
              colPointY + (b2.radius * (b2.position.y - b1.position.y)) / d;
          }
          //updating vto reflect collision
          if (!b1.isStatic) {
            b1.vx -= p * b1.mass * nx;
            b1.vy -= p * b1.mass * ny;
          }
          if (!b2.isStatic) {
            b2.vx += p * b2.mass * nx;
            b2.vy += p * b2.mass * ny;
          }
        }
      }
    }
  }
};

const move = () => {
  for (let i = 0; i < allParticles.length; i++) {
    const particle = allParticles[i];
    // particle.applyForce(gravity);
    if (!particle.isStatic) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += gravity.y;
      checkBounds(particle);
      checkParticles(particle);
    }
  }
};

const update = delta => {
  move();
};

const setup = () => {
  const container = new PIXI.Container();

  app.stage.addChild(container);
  for (let index = 0; index < 20; index++) {
    const mass = 10 + Math.random() * 10;
    const particle = new Particle({
      x: Math.random() * window.innerWidth,
      y: -100,
      mass
    });
    container.addChild(particle);
    allParticles.push(particle);
  }

  

  for (let index = 0; index < predefinedShapes.length; index++) {
    // const element = 10;

    const { x, y } = predefinedShapes[index];
    const staticParticle = new Particle({
      mass: 100,
      x: x - 60,
      y: y - 110,
      isStatic: true
    });
    // container.addChild(staticParticle);
    allParticles.push(staticParticle);
  }
  app.ticker.add(update);

  const staticShapes = [];

  window.addEventListener("mousedown", e => {
    const mass = 10 + Math.random() * 10;
    const particle = new Particle({
      x: Math.random() * window.innerWidth,
      y: -100,
      mass
    });
    container.addChild(particle);
    allParticles.push(particle);

    // const staticParticle = new Particle({
    //   mass: 30,
    //   x: e.clientX,
    //   y: e.clientY,
    //   isStatic: true
    // });
    // container.addChild(staticParticle);
    // staticShapes.push({ x: staticParticle.x, y: staticParticle.y });
    // allParticles.push(staticParticle);

    // console.log(staticShapes);
  });
};

setup();
