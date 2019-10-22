import "./index.css";
import "./App.css";
import * as PIXI from "pixi.js";
import VerletPoint from "./VerletPoint";
import VerletStick from "./VerletStick";

const verletPoints = [];
const sticks = [];

let screenRect = {
  left: 0,
  right: window.innerWidth,
  top: 0,
  bottom: window.innerHeight
};

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: false,
  backgroundColor: 0xffffff
});

const canvas = new PIXI.Graphics();

document.body.appendChild(app.view);

window.addEventListener("resize", function() {
  screenRect = {
    left: 0,
    right: window.innerWidth,
    top: 0,
    bottom: window.innerHeight
  };
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const drawVerletStructures = () => {
  for (let index = 0; index < sticks.length; index++) {
    const stick = sticks[index];

    canvas.beginFill(0xff0000);
    canvas.drawCircle(stick.pointA.x, stick.pointA.y, 3);
    canvas.drawCircle(stick.pointB.x, stick.pointB.y, 3);
    canvas.moveTo(stick.pointA.x, stick.pointA.y);
    canvas.lineStyle(1, 0x000000);
    canvas.lineTo(stick.pointB.x, stick.pointB.y);
  }
};
const updateSticks = () => {
  for (let index = 0; index < sticks.length; index++) {
    const stick = sticks[index];

    stick.update();
  }
};
const updatePoints = () => {
  for (let index = 0; index < verletPoints.length; index++) {
    const point = verletPoints[index];

    // point.y += 0.5;
    point.update();
  }
};
const constrainPoints = () => {
  for (let index = 0; index < verletPoints.length; index++) {
    const point = verletPoints[index];

    point.constrain(screenRect);
  }
};

const update = delta => {
  const stiffness = 2;
  canvas.clear();

  updatePoints();

  for (let index = 0; index < stiffness; index++) {
    constrainPoints();
    updateSticks();
  }

  drawVerletStructures();
};

const createRope = (segments, length) => {
  const ropePoints = [];
  const points = segments % 2 === 0 ? segments : segments + 1;
  for (let index = 0; index < points; index++) {
    const verletPoint = new VerletPoint(100 + Math.random() * 100, index * length+Math.random()*2);
    verletPoints.push(verletPoint);
    ropePoints.push(verletPoint);
  }

  for (let index = 0; index < ropePoints.length - 1; index++) {
    const pointA = ropePoints[index];
    const pointB = ropePoints[index + 1];
    const stick = new VerletStick(pointA, pointB, length);
    sticks.push(stick);
  }
};

const setup = () => {
  const amount = 5;

  createRope(amount, 100);

  app.stage.addChild(canvas);
  app.ticker.add(update);
};

setup();
