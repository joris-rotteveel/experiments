import "./index.css";
import "./App.css";
import * as PIXI from "pixi.js";
import VerletPoint from "./VerletPoint";
import VerletStick from "./VerletStick";

import leftSrc from "./assets/left.png";
import rightSrc from "./assets/right.png";
import centerSrc from "./assets/center.png";

let left = PIXI.Sprite.from(leftSrc);
let center = PIXI.Sprite.from(centerSrc);
let right = PIXI.Sprite.from(rightSrc);

const lookup = [
  {
    pointA: null,
    pointB: null,
    sprite: left,
  },
  {
    pointA: null,
    pointB: null,
    sprite: center,
  },
  {
    pointA: null,
    pointB: null,
    sprite: right,
  },
];

const verletPoints = [];
const sticks = [];
let xwind = 0;
let ywind = 0;
let angleX = 0;
let angleY = 0;

let screenRect = {
  left: 0,
  right: window.innerWidth,
  top: 0,
  bottom: window.innerHeight,
};

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: false,
  backgroundColor: 0xffffff,
});

const canvas = new PIXI.Graphics();

document.body.appendChild(app.view);

window.addEventListener("resize", function () {
  screenRect = {
    left: 0,
    right: window.innerWidth,
    top: 0,
    bottom: window.innerHeight,
  };
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const drawVerletStructures = () => {
  for (let index = 0; index < sticks.length; index++) {
    const stick = sticks[index];

    canvas.beginFill(0x000000);
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

    point.x += xwind;
    point.y += ywind;
    point.update();
  }
};
const constrainPoints = () => {
  for (let index = 0; index < verletPoints.length; index++) {
    const point = verletPoints[index];

    point.constrain(screenRect);
  }
};

const update = (delta) => {
  const stiffness = 2;
  canvas.clear();

  xwind = Math.cos(angleX) * 0.05;
  ywind = Math.sin(angleY) * 0.075;
  angleY += 0.01;
  angleX += 0.03;

  updatePoints();

  for (let index = 0; index < stiffness; index++) {
    constrainPoints();
    updateSticks();
  }

  for (let index = 0; index < lookup.length; index++) {
    const { sprite, pointA, pointB } = lookup[index];

    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;

    const xpos = pointB.x; // + (pointB.x - pointB.x) / 2;
    const ypos = pointB.y; //+ (pointB.y - pointA.y) / 2;
    sprite.x = xpos;
    sprite.y = ypos;
    sprite.rotation = Math.atan2(dy, dx);
  }
  drawVerletStructures();
};

const createRope = (segments, length) => {
  const ropePoints = [];
  const points = segments % 2 === 0 ? segments : segments + 1;

  for (let index = 0; index < points; index++) {
    const verletPoint = new VerletPoint(
      100 + Math.random() * 100,
      index * length + Math.random() * 2
    );
    verletPoints.push(verletPoint);
    ropePoints.push(verletPoint);
  }

  const lengths = [235, 600, 235];

  for (let index = 0; index < ropePoints.length - 1; index++) {
    const pointA = ropePoints[index];
    const pointB = ropePoints[index + 1];

    const stick = new VerletStick(pointA, pointB, lengths[index]);
    sticks.push(stick);
  }

  lookup[0].pointA = sticks[0].pointA;
  lookup[0].pointB = sticks[0].pointB;

  lookup[1].pointA = sticks[1].pointA;
  lookup[1].pointB = sticks[1].pointB;

  lookup[2].pointA = sticks[2].pointA;
  lookup[2].pointB = sticks[2].pointB;
};

const setup = () => {
  createRope(3, 400);

  app.stage.addChild(canvas);
  app.stage.addChild(left);
  app.stage.addChild(center);
  app.stage.addChild(right);
  app.ticker.add(update);
};

setup();

