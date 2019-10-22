import "./index.css";
import "./App.css";
import * as PIXI from "pixi.js";
import Pose from "./Pose";
import { createVector, p5 } from "./p5/p5";
import { poses } from "./demo-pose";
import image from "./assets/screen.png";
// import image from "./assets/image.jpg";

const G = 1;
const allParticles = [];
const attractors = [];
let currentPoses = null;
let posenet = null;
let imageElement = null;
const video = document.getElementById("video");

// https://github.com/tensorflow/tfjs-models/tree/master/posenet

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true
  // backgroundColor: 0xffffff
});

const canvas = new PIXI.Graphics();

document.body.appendChild(app.view);

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const updatePoses = () => {
  // for (let index = 0; index < poses.length; index++) {
  //   const poseData = poses[index];
  //   const currentPose = currentPoses[index];
  //   currentPose.setPose(poseData);
  // }
};
const updateCircles = () => {
  canvas.clear();
  canvas.lineStyle(1, 0xff0000, 1);
  if (!currentPoses) return;

  const parts = [
    // "leftEye",
    // "rightEye",
    // "nose",
    // "leftShoulder",
    // "rightShoulder",
    // "rightElbow",
    // "leftShoulder",
    // "leftHip",
    // "rightHip",
    // "leftKnee",
    // "rightKnee"
  ];

  const connectionPerPose = [
    // { from: "leftHip", to: "leftShoulder", clockwise: true },
    { from: "leftHip", to: "leftKnee", clockwise: true },

    { from: "leftWrist", to: "leftElbow", clockwise: true },
    { from: "leftElbow", to: "leftShoulder", clockwise: false },

    { from: "leftWrist", to: "leftShoulder", clockwise: false },
    { from: "leftWrist", to: "leftElbow", clockwise: true },
    { from: "leftElbow", to: "leftShoulder", clockwise: false },

    { from: "rightWrist", to: "rightShoulder", clockwise: true },
    { from: "rightWrist", to: "rightElbow", clockwise: true },
    { from: "rightElbow", to: "rightShoulder", clockwise: true },

    // { from: "rightHip", to: "rightShoulder", clockwise: true },
    { from: "rightHip", to: "rightKnee", clockwise: false }
  ];

  const threshold = 0.12;
  canvas.lineStyle(1, 0xff0000, 1);

  for (let index = 0; index < currentPoses.length; index++) {
    const { keypoints, score } = currentPoses[index];
    if (score > threshold) {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        const details = keypoints.filter(i => i.part === part)[0];
        canvas.beginFill(0xff0000, 0.5);
        canvas.drawCircle(details.position.x, details.position.y, 7);
        canvas.endFill();
      }

      for (let index = 0; index < connectionPerPose.length; index++) {
        const connection = connectionPerPose[index];
        const clockwise = connection.clockwise;

        const from = keypoints.filter(i => i.part === connection.from)[0];
        const to = keypoints.filter(i => i.part === connection.to)[0];

        const posA = createVector(from.position.x, from.position.y);
        const posB = createVector(to.position.x, to.position.y + 0);
        const middle = p5.Vector.lerp(posA, posB, 0.5);

        const dy = posA.y - posB.y;
        const dx = posA.x - posB.x;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const currentHeading = Math.atan2(dy, dx);
        const newAngle = currentHeading;
        const centerOffset = 240;
        const x = middle.x + Math.cos(newAngle) * centerOffset;
        const y = middle.y + Math.sin(newAngle) * centerOffset;
        const controlPoint = createVector(x, y);

        //go through the control point!
        const cpx = controlPoint.x * 2 - (posA.x + posB.x) / 2;
        const cpy = controlPoint.y * 2 - (posA.y + posB.y) / 2;

        // canvas.quadraticCurveTo(cpx, cpy, headB.position.x, headB.position.y);
        if (clockwise) {
          drawArc(posB, posA, distance / 2);
        } else {
          drawArc(posA, posB, distance / 2);
        }
      }
    }
  }
};

const drawArc = (posA, posB, radius) => {
  const middle = p5.Vector.lerp(posA, posB, 0.5);
  const dxFromCenter = posB.x - posA.x;
  const dyFromCenter = posB.y - posA.y;
  const dxFromCenter2 = posA.x - posB.x;
  const dyFromCenter2 = posA.y - posB.y;

  const startAngle = Math.atan2(dyFromCenter2, dxFromCenter2);

  const farAngle = Math.atan2(dyFromCenter, dxFromCenter); //- angleOffset;
  canvas.moveTo(posA.x, posA.y);
  canvas.lineStyle(3, 0xff0000, 1);
  // canvas.beginFill(0x000000, 0.5);
  canvas.arc(middle.x, middle.y, radius, startAngle, farAngle, true);
  // canvas.endFill();
};

const update = delta => {
  // updatePoses();
  // updateCircles();
  // estimatePoses();
};

const estimatePoses = () => {
  if (posenet && video.readyState === 4) {
    posenet
      .estimateMultiplePoses(video, {
        flipHorizontal: false,
        maxDetections: 12,
        scoreThreshold: 0.15,
        nmsRadius: 20
      })
      .then(p => {
        currentPoses = [...p];
        updateCircles();
        estimatePoses();
      });
  }
};

const setup = () => {
  imageElement = document.createElement("img");
  imageElement.src = image;

  const video = document.getElementById("video");
  video.oncanplaythrough = () => {
    window.posenet.load().then(net => {
      posenet = net;
      estimatePoses();
      app.ticker.add(update);
    });
  };

  let sprite = PIXI.Sprite.from(image);

  const container = new PIXI.Container();
  container.addChild(canvas);

  // app.stage.addChild(sprite);
  app.stage.addChild(container);

  window.addEventListener("mouseup", e => {
    estimatePoses();
  });
};

setup();
