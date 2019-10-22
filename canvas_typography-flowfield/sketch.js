const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
  fps: 60
};

const sketch = ({ width, height }) => {
  let angle = 0;
  const count = 50;
  const margin = width * 0.15;
  const fontFamily = '"Andale Mono"';
  const background = "hsl(0, 0%, 0%)";
  const characters = "My milkshake brings all the boys to the yard  And they're like, it's better than yours Damn right it's better than yours ".split(
    ""
  );

  const typeState = [...characters];

  const createGrid = () => {
    const points = [];
    const frequency = random.range(0.75, 1.25);
    let charIndex = 0;
    let colour = "#FF0000";
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = x / (count - 1);
        let v = y / (count - 1);

        const n = random.noise2D(u * frequency, v * frequency);

        if (charIndex > characters.length - 1) charIndex = 0;

        points.push({
          color: colour,
          size: 20 + 20 * (charIndex / characters.length), //Math.abs(baseSize * size + random.gaussian() * sizeOffset),
          rotation: n * Math.PI * 0.65,
          offsetAngle: n * Math.PI,
          character: characters[charIndex],
          characterIndex: charIndex,
          position: [u, v]
        });

        charIndex += 1;
      }
    }
    return points;
  };

  const grid = createGrid();
  window.onmousedown=()=>{
    angle += 0.05;
  }

  return ({ context, width, height, playhead }) => {
    
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    let colour = "#ff0000";
    grid.forEach(
      ({ position, rotation, size, characterIndex, offsetAngle }) => {
        const [u, v] = position;
        // do the magic here - we can change this formula and get very different behaviour
        const x = lerp(margin, width - margin, u) + Math.cos(offsetAngle+angle) * 100;
        const y =
          lerp(margin, height - margin, v) - Math.sin(offsetAngle+angle) * 200;

        context.fillStyle = colour;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `${size}px ${fontFamily}`;

        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.globalAlpha = 0.85;
        context.fillText(typeState[characterIndex], 0, 0);
        context.restore();
        if (characters[characterIndex] === " ") {
          colour = "#FF0000";
        } else {
          colour = "#FFFFFF";
        }
      }
    );
  };
};

canvasSketch(sketch, settings);
