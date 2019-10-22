// run in console: canvas-sketch sketch.js --open

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const p5 = require("p5");

new p5();

const randomColour = () => {
  const colours = ["#fbb230", "#f75275", "#989898"];
  return colours[Math.round(Math.random() * (colours.length - 1))];
};
const randomSquareColour = () => {
  const colours = ["#050505", "#fbb230", "#f75275", "#989898"];
  return colours[Math.round(Math.random() * (colours.length - 1))];
};
const randomInRange = (min, max) => min + Math.random() * (max - min);
const getLineWidth = () => randomInRange(5, 25);

const width = 1048;
const height = 1048;

const settings = {
  dimensions: [width, height],
  p5: true,
  animate: false,
  duration: 4
  // Enable MSAA
  // attributes: {
  //   antialias: true
  // }
};

const lines = [];

const sizeX = 95;
const sizeY = 200;
const margin = 100;
const rows = Math.ceil((width - margin * 2) / sizeY);
const cols = Math.ceil((height - margin * 2) / sizeX);
console.log(cols);
for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    lines.push({
      x: margin + x * sizeX,
      y: margin + y * sizeY,
      style: { lineWidth: getLineWidth(), strokeStyle: randomColour() }
    });
  }
}

window.mouseClicked = () => {};
window.mouseMoved = () => {};

const defaultStyle = {
  lineWidth: 1,
  lineCap: "square"
};

const sketch = ({ width, height }) => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);

    lines.forEach(({ x, y, style = {} }, index) => {
      Object.keys(defaultStyle).forEach(key => {
        context[key] = defaultStyle[key];
      });
      //override with special line styles if needed
      Object.keys(style).forEach(key => {
        context[key] = style[key];
      });

      //circles

      const startAngle = randomInRange(-Math.PI, Math.PI * 2);
      const endAngle = startAngle + randomInRange(0, Math.PI*0.75); //(Math.PI / 2) * (1 * Math.random());
      const radius = 35 + Math.random() * 20;

      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, false);
      context.stroke();

      Object.keys(defaultStyle).forEach(key => {
        context[key] = defaultStyle[key];
      });

      context.save();
      context.fillStyle = randomSquareColour();
      const w = randomInRange(5, 35);

      const startX = x + Math.cos(startAngle) * radius;
      const startY = y + Math.sin(startAngle) * radius;

      const endX = x + Math.cos(startAngle) * 50;
      const endY = y + Math.sin(startAngle) * 50;

      const dx = startX - endX;
      const dy = startY - endY;

      const rotateAngle = Math.atan2(dy, dx);

      context.translate(startX, startY);
      context.rotate(rotateAngle);

      context.fillRect(-w / 2, -w / 2, w, w);

      context.restore();
      //draw a rect on the points
    });
  };
};

canvasSketch(sketch, settings);
