// run in console: canvas-sketch sketch.js --open  --output=media

import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import p5 from "p5";
new p5();

import Particle from "./components/Particle";




const settings = {
  dimensions: [2048, 2048],
  p5: true,
  animate: true,
  duration: 4
};
const allParticles = [];
const gravity=createVector(0,1);

const setup = () => {
  for (let index = 0; index < 100; index++) {
    const particle = new Particle({
      x: random.value() * settings.dimensions[0],
      y: random.value() * settings.dimensions[1],
      mass: 10 + random.value() * 10
    });
    allParticles.push(particle);
  }
};

const sketch = ({ width, height }) => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    for (let index = 0; index < allParticles.length; index++) {
      const particle = allParticles[index];
      const { mass, position } = particle;
      particle.applyForce(gravity);
      
      particle.update();

      const { x, y } = position;
      context.moveTo(x, y);
      context.beginPath();
      context.arc(x, y, mass, 0, 2 * Math.PI);
      context.stroke();
    }
  };
};

setup();
canvasSketch(sketch, settings);
