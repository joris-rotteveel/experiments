const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");

const p5 = require("p5");
// Attach p5.js it to global scope
new p5();

const settings = {
  p5: true,
  dimensions: [1024, 1024],
};

const sketch = ({ width, height }) => {
  const count = 155;
  const margin = width * 0.01;
  const sourceImage = new Image();

  const createGrid = (context) => {
    const points = [];
    let xoff = 0;
    let yoff = 0;
    let zoff = 0;
    const noiseSpeed = 0.31;
    const magnifyFactor = 100;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = x / (count - 1);
        let v = y / (count - 1);

        const mapX = Math.round(u * 449);
        const mapY = Math.round(v * 449);

        const rgba = context.getImageData(mapX, mapY, 1, 1).data;
        const colorSteps = 1 / 3;
        const maxColor = 255;
        const red = (rgba[0] / maxColor) * colorSteps;
        const green = (rgba[1] / maxColor) * colorSteps;
        const blue = (rgba[2] / maxColor) * colorSteps;

        const totalPercentage = red + green + blue;

        const scale = 1 - totalPercentage; //noise(xoff, yoff, zoff);
        const angleFromColour = 0; //scale * Math.PI * 2 * magnifyFactor;
        const rotation = p5.Vector.fromAngle(angleFromColour)
          .setMag(1)
          .heading();

        points.push({
          rotation: rotation,
          scale: scale,
          color: "#ff000ff",
          position: [u, v],
        });

        yoff += noiseSpeed;
      }
      xoff += noiseSpeed;
    }
    return points;
  };

  const coords = [];

  return ({ context, width, height }) => {
    sourceImage.onload = () => {
      context.drawImage(sourceImage, 0, 0);
      const w = 450;
      const h = 450;
      const map = {};
      let counterX = 0;
      let counterY = 0;
      const step = 70;

      const grid = createGrid(context);

      context.fillStyle = "#e3e3e3";
      // context.fillRect(0, 0, width, height);

      grid.forEach(({ position, rotation, scale, color }) => {
        const [u, v] = position;
        const x = lerp(margin, width - margin, u);
        const y = lerp(margin, height - margin, v);

        const size = 30 * scale;

        // draw -
        coords.push({ x, y, size, rotation, color });
      });

      // clear canvas
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      coords.forEach(({ x, y, size, rotation, color }) => {
        context.fillStyle = context.strokeStyle = color;
        context.save();
        context.translate(x, y);
        context.rotate(rotation);

        // context.moveTo(0, 0);
        context.strokeRect(0, 0, size, size);
        context.beginPath();
        context.arc(0, 0, size / 12, 0, Math.PI * 2, true);
        context.closePath();
        // context.arc(0, 0, size / 10, 0, 2 * Math.PI, false);
        // context.lineTo(-size / 2, 0);
        // context.moveTo(0, 0);
        // context.lineTo(size / 2, 0);
        // context.moveTo(0, -size / 2);

        // context.lineTo(0, size / 2);

        context.restore();
        context.stroke();
      });
    };
    sourceImage.src = "ben.png";
    // sourceImage.onload();
  };
};

canvasSketch(sketch, settings);
