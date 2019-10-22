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
  const colours = ["#999999", "#898989", "  #7a7a7a", "#6b6b6b"];
  return colours[Math.round(Math.random() * (colours.length - 1))];
};

const sketch = ({ width, height }) => {
  const count = 25;
  const margin = width * 0.15;

  const createGrid = () => {
    const points = [];
    let xoff = 0;
    let yoff = 0;
    let zoff = 0.1;
    const noiseSpeed = 0.09; //3.91;
    const magnifyFactor = 10;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = x / (count - 1);
        let v = y / (count - 1);

        const scale = noise(xoff, yoff, zoff);
        const angleFromColour = scale * Math.PI * 2 * magnifyFactor;
        const rotation = p5.Vector.fromAngle(angleFromColour)
          .setMag(1)
          .heading();

        points.push({
          rotation: rotation,
          scale: scale,
          color: randomColour(),
          position: [u, v]
        });

        yoff += noiseSpeed;
      }
      xoff += noiseSpeed;
    }
    return points;
  };

  return ({ context, width, height }) => {
    const grid = createGrid(context);

    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    context.moveTo(0, 0);
    grid.forEach(({ position, rotation, scale, color }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.fillStyle = context.strokeStyle = color;

      const size = 200 * (scale * scale * scale);

      // draw -

      // --lines
      // context.lineTo(x, y);
      // context.lineTo(0, y);
      // context.stroke();

      context.save();
      context.translate(x, y);
      context.rotate(rotation);

      context.moveTo(0, 0);
      context.beginPath();
      const drawCirle = size > 50;
      if (drawCirle) {
        context.arc(0, 0, size * 0.25, 0, 2 * Math.PI);
        context.fill();
        context.moveTo(0, 0);
        context.lineTo(-size / 2, 0);
        context.moveTo(0, 0);
        context.lineTo(size / 2, 0);
        context.moveTo(0, -size / 2);
        context.lineTo(0, size / 2);
        context.stroke();
      } else {
        // --cross


        // -- triangle
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-size / 2, size);
        context.lineTo(size / 2, size);

        context.lineTo(0, 0);
        context.fill();
      }
      context.restore();
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
