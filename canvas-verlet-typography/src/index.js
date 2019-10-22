import "./index.css";
import "./App.css";
import * as PIXI from "pixi.js";
import VerletPoint from "./VerletPoint";
import VerletStick from "./VerletStick";
import Letter from "./Letter";

const verletPoints = [];
const sticks = [];
const letters = [];
let hasAnimation = true;
let angle = 0;

let screenRect = {
  left: 0,
  right: window.innerWidth,
  top: 0,
  bottom: window.innerHeight
};

const canvasElement = document.getElementById("app");
const ctx = canvasElement.getContext("2d");

const onResize = () => {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  screenRect = {
    left: 0,
    right: window.innerWidth,
    top: 0,
    bottom: window.innerHeight-100
  };
};
window.addEventListener("resize", onResize);

const drawVerletStructures = () => {
  for (let index = 0; index < sticks.length; index++) {
    const stick = sticks[index];
    const startColour = stick.isStatic ? 0x00ff00 : 0x000000;
    // canvas.beginFill(startColour);
    // canvas.drawCircle(stick.pointA.x, stick.pointA.y, stick.isStatic ? 1 : 3);
    // canvas.beginFill(0x000000);
    // canvas.drawCircle(stick.pointB.x, stick.pointB.y, 3);
    // ctx.lineStyle(1, 0x000000);
    ctx.beginPath();
    ctx.strokeStyle = 0xff0000;
    ctx.moveTo(stick.pointA.x, stick.pointA.y);
    ctx.lineTo(stick.pointB.x, stick.pointB.y);
    ctx.stroke();
  }
};
const updateSticks = () => {
  angle += 0.2;
  for (let index = 0; index < sticks.length; index++) {
    const stick = sticks[index];
    stick.update();
  }
};
const updatePoints = () => {
  for (let index = 0; index < verletPoints.length; index++) {
    const point = verletPoints[index];

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
  const stiffness = 1;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  updatePoints();

  for (let index = 0; index < stiffness; index++) {
    constrainPoints();
    updateSticks();
  }
  for (let index = 0; index < letters.length; index++) {
    const letter = letters[index];
    letter.update();
    letter.draw(ctx);
  }
  // drawVerletStructures();

  requestAnimationFrame(update);
};

const createRope = (text, length, isStatic, xpos) => {
  const segments = text.length;
  const ropePoints = [];
  const points =
    segments > 2 && segments % 2 === 0 ? segments + 1 : segments + 1;
  for (let index = 0; index < points; index++) {
    const isStaticPoint = isStatic && index === 0;
    const verletPoint = new VerletPoint(
      xpos + index * 60 * Math.random(),
      window.innerHeight / 2 - index * 10,
      index
    );
    verletPoint.vy = isStaticPoint ? 0 : 5 + Math.random() * 10;
    verletPoint.vx = isStaticPoint ? 0 :0// Math.random() * 10 - 5;
    verletPoint.startVY = verletPoint.vy;
    verletPoint.startVX = verletPoint.vx;

    verletPoint.setStatic(isStaticPoint);
    verletPoints.push(verletPoint);
    ropePoints.push(verletPoint);
  }

  for (let index = 0; index < ropePoints.length - 1; index++) {
    const pointA = ropePoints[index];
    const pointB = ropePoints[index + 1];
    const stick = new VerletStick(pointA, pointB, length, isStatic);

    const letter = new Letter(text.charAt(index), stick);
    letters.push(letter);

    sticks.push(stick);
  }
};

const setup = () => {
  onResize();
  const amount = 5;

  const text = "my milkshake brings all the boys to the yard".split(" ");

  for (let index = 0; index < text.length; index++) {
    const word = text[index];
    const isStatic = true;//index % 2 === 99990;
    const xpos = 300 + 70 * index;
    createRope(word, 50 + Math.random() * 10, isStatic, xpos);
  }

  requestAnimationFrame(update);
};

setup();
