import * as PIXI from "pixi.js";

import Line from "./line";
import Tiki from "./tiki";

export const radsToDeg = (radians) => {
  return radians * (180 / Math.PI);
};
export const degToRads = (degrees) => {
  return (degrees * Math.PI) / 180;
};

export const getPointOnLine = (pointA, pointB, pct) => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const length = Math.sqrt(dx * dx + dy * dy) * pct;
  const angle = Math.atan2(dy, dx);
  const x = pointA.x - Math.cos(angle) * length;
  const y = pointA.y - Math.sin(angle) * length;

  return { x, y };
};

export const getPointOnCurve = (line, pct) => {
  const { startPoint, controlPoint, endPoint } = line;

  const pointBetweenAandB = getPointOnLine(startPoint, controlPoint, pct);
  const pointBetweenCandB = getPointOnLine(controlPoint, endPoint, pct);

  const intersection = getPointOnLine(
    pointBetweenAandB,
    pointBetweenCandB,
    pct
  );

  return intersection;
};
export default class App {
  constructor() {
    const app = new PIXI.Application({
      backgroundColor: 0x000000,
      resizeTo: window,
      antialias: true,
    });

    this.mouseX = this.mouseY = 0;
    document.body.appendChild(app.view);
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    document.addEventListener("keydown", () => {
      let thing = "[";
      lines.forEach((l) => {
        thing += l.toString();
      });
      thing += "]";
      console.log(thing);

      thing = "[";
      tikis.forEach((l) => {
        thing += l.toString();
      });
      thing += "]";
      // console.log(thing);
    });

    // create a new Sprite from an image path

    const grfx = new PIXI.Graphics();

    app.stage.addChild(grfx);

    const tikis = [];
    const radius = 200;

    const tikiConfig = [
      {
        startPoint: { x: 289, y: 263 },
      },
      {
        startPoint: { x: 405, y: 473 },
      },
    ];

    tikiConfig.forEach(({ startPoint }) => {
      const tiki = new Tiki({ startPoint });

      app.stage.addChild(tiki.sprite);
      tikis.push(tiki);
    });

    const config = [
      {
        startPoint: { x: 291, y: 255 },
        controlPoint: { x: 461, y: 306 },
        endPoint: { x: 417, y: 459 },
      },
      {
        startPoint: { x: 258, y: 478 },
        controlPoint: { x: 228, y: 354 },
        endPoint: { x: 283, y: 279 },
      },
      {
        startPoint: { x: 252, y: 377 },
        controlPoint: { x: 355, y: 296 },
        endPoint: { x: 394, y: 456 },
      },
      {
        startPoint: { x: 400, y: 484 },
        controlPoint: { x: 231, y: 427 },
        endPoint: { x: 57, y: 635 },
      },

      {
        startPoint: { x: 324, y: 362 },
        controlPoint: { x: 399, y: 196 },
        endPoint: { x: 578, y: 220 },
      },
    ];
    // https://javascript.info/bezier-curve#de-casteljau-s-algorithm

    const lines = config.map((c) => {
      const line = new Line(c);
      app.stage.addChild(line.debugContainer);
      return line;
    });

    lines[3].connect(lines[1], 0.5);
    lines[1].connect(lines[2], 0.35);
    lines[2].connect(lines[4], 0.65);

    // Listen for animate update
    app.ticker.add(() => {
      grfx.clear();

      tikis.forEach((t, index) => {
        t.update();
      });

      lines.forEach((line) => {
        const { startPoint, endPoint, controlPoint } = line;
        const points = [controlPoint];
        points.forEach((point) => {
          // point.x += 1;
          const dx = point.original.x - this.mouseX;
          const dy = point.original.y - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;
          console.log(dist);
          // if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          const offset = Math.max(0, maxDist - dist);
          const tx = point.original.x + Math.cos(angle) * offset;
          const ty = point.original.y + Math.sin(angle) * offset;
          point.x += (tx - point.x) * 0.037;
          point.y += (ty - point.y) * 0.037;

          //   line.setAlpha(offset / maxDist);
          // }
        });

        // grfx.beginFill(0x00ff00);
        // const intersection = getPointOnCurve(line, pct);
        // grfx.drawCircle(intersection.x, intersection.y, 10);
        // grfx.endFill();

        line.draw(grfx);
      });
    });
  }
}
