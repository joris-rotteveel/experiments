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
  const fontFamily = '"Helvetica"';
  const background = "hsl(0, 0%, 0%)";
  const sentnce = "founded in 2012, grafik studio   ";
  const characters = sentnce.split("");

  const redIndexStart = sentnce.indexOf("grafik");
  const redIndexEnd = "grafik".length;

  const typeState = [...characters];

  const createGrid = () => {
    const points = [];
    const frequency = random.range(0.75, 1.25);
    let charIndex = 0;
    let shouldChange = false;
    let loops = 0;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = x / (count - 1);
        let v = y / (count - 1);

        const n = random.noise2D(u * frequency, v * frequency);

        if (charIndex > characters.length - 1) {
          loops++;
          charIndex = 0;
          if (loops === 21) {
            shouldChange = true;
          } else {
            shouldChange = false;
          }
        }

        const isInRange =
          shouldChange &&
          charIndex >= redIndexStart - 1 &&
          charIndex < redIndexStart + redIndexEnd;

        points.push({
          size: isInRange ? 40 : 20, //+ 20 * (charIndex / characters.length), //Math.abs(baseSize * size + random.gaussian() * sizeOffset),
          rotation: n * Math.PI * 0.65,
          offsetAngle: n * Math.PI,
          character: characters[charIndex],
          characterIndex: charIndex,
          position: [u, v],
          colour: isInRange ? "#ffffff" : "#FFFFFF"
        });

        charIndex += 1;
      }
    }
    return points;
  };

  const grid = createGrid();
  window.onmousedown = () => {
    angle += 0.05;
  };
  return ({ context, width, height, playhead }) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    grid.forEach(
      ({ position, rotation, size, characterIndex, offsetAngle, colour }) => {
        const [u, v] = position;
        // do the magic here - we can change this formula and get very different behaviour
        const x =
          lerp(margin, width - margin, u) +
          Math.cos(+angle) * (characterIndex * 58);
        const y =
          lerp(margin, height - margin, v) +
          Math.cos(+angle) * (-100 + characterIndex * 54);

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
      }
    );
  };
};

canvasSketch(sketch, settings);
