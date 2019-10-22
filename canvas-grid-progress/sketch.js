const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");

const p5 = require("p5");
// Attach p5.js it to global scope
new p5();

const settings = {
  p5: true,
  dimensions: [2048, 2048]
};

const randomColour = () => {
  const colours = ["#fbb230", "#f75275", "#989898"];
  return colours[Math.round(Math.random() * (colours.length - 1))];
};
const randomSquareColour = () => {
  const colours = [ "#fbb230", "#f75275", "#989898"];
  return colours[Math.round(Math.random() * (colours.length - 1))];
};
const randomInRange = (min, max) => min + Math.random() * (max - min);
const getLineWidth = () => randomInRange(5, 25);

const getPoint = (xoff, yoff, zoff) => {
  const scale = noise(xoff, yoff, zoff);
  const angleFromColour = scale * Math.PI;
  const direction = Math.random() > 0.5 ? -1 : 1;
  const rotation = p5.Vector.fromAngle(angleFromColour)
    .setMag(direction)
    .heading();
  return {
    startAngle:0,
    position: [0, 0],
    rotation: rotation,
    scale,
    lineWidth:scale*scale*25,// getLineWidth(),
    color: randomColour()
  };
};

const sketch = ({ width, height }) => {
  const count = 5;
  const margin = width * 0.1;

  const createGrid = () => {
    const points = [];
    let xoff = 0;
    let yoff = 0;
    let zoff = 0.1;
    const noiseSpeed = 0.09;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = x / (count - 1);
        let v = y / (count - 1);

        const point = getPoint(xoff, yoff, zoff);
        point.position = [u, v];
        points.push(point);

        if (Math.random() > 0.95) {
          const extraPoint = getPoint(xoff, yoff, zoff + 0.2);
          extraPoint.position = [u + 0.01, v];
          points.push(extraPoint);
        }

        yoff += noiseSpeed;
      }
      xoff += noiseSpeed;
    }
    return points;
  };

  return ({ context, width, height }) => {
    const grid = createGrid(context);

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.moveTo(0, 0);
    grid.forEach(({ position, rotation, scale, color,startAngle,lineWidth }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      // const startAngle = randomInRange(0, Math.PI);
      const endAngle = rotation;
      const radius = 120 * scale * scale; // 35 + Math.random() * 20;
      const size = 200 * (scale * scale * scale);

      context.fillStyle = context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineCap = "square";

      // draw -

      context.save();
      context.translate(x, y);

      context.beginPath();
      context.arc(0, 0, radius, startAngle, endAngle);
      context.stroke();

      context.restore();

      context.save();
      context.fillStyle = randomSquareColour();
      const w =  randomInRange(lineWidth/2, lineWidth*2);

      const startX = x + Math.cos(startAngle) * radius;
      const startY = y + Math.sin(startAngle) * radius;

      const endX = x + Math.cos(startAngle) * 10;
      const endY = y + Math.sin(startAngle) * 10;

      const dx = startX - endX;
      const dy = startY - endY;

      const rotateAngle = Math.atan2(dy, dx);

      context.translate(startX, startY);
      context.rotate(rotateAngle);

      context.fillRect(-w / 2, -w / 2, w, w);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
