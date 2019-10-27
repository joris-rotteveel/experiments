import "./index.css";
let angle = 0;

let screenRect;

const canvasElementSource = document.getElementById("source");
const contextSource = canvasElementSource.getContext("2d");
const canvasElement = document.getElementById("app");
const context = canvasElement.getContext("2d");

const fonts = ["Helvetica", "ComicSansMS", "Arial", "AmericanTypewriter"];
let fontFamily = '"Helvetica"';

const onResize = () => {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  canvasElementSource.width = window.innerWidth;
  canvasElementSource.height = window.innerHeight;
  screenRect = {
    width: window.innerWidth,

    height: window.innerHeight
  };
};
window.addEventListener("resize", onResize);

const drawSource = (angle = 0, fontAngle) => {
  const { width, height } = screenRect;
  contextSource.fillStyle = "#000000";
  contextSource.fillRect(0, 0, width, height);
  // Rotated rectangle
  contextSource.save();
  contextSource.translate(width / 2, height / 2);
  contextSource.rotate(angle);
  contextSource.translate(-width / 2, -height / 2);
  contextSource.fillStyle = "#FFFFFF";
  // we could change fontFamily too!
  const middle = (fonts.length - 1) / 2;
  const index = middle + Math.cos(fontAngle) * middle;

  contextSource.font = `${Math.cos(angle) * 400}px ${fontFamily}`;
  contextSource.textAlign = "center";
  contextSource.textBaseline = "middle";
  contextSource.fillText("grafik", width / 2, height / 2);
  contextSource.restore();
};

const update = delta => {
  const { width, height } = screenRect;
  angle += 0.1;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
  drawSource();

  //draw letter to seperate canvas
  //copy pixels rect from that canvas onto this canvas
  //profit

  const tilesX = 8; //+Math.abs(Math.cos(angle*0.3)*6);
  const tilesY = 8; //+Math.abs(Math.sin(angle)*6);;

  const tileW = Math.ceil(width / tilesX);
  const tileH = Math.ceil(height / tilesY);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const sin = Math.sin(angle + x * y);
      const wave = sin * 20;
      drawSource(0.1 * sin * 0.02 * Math.PI * (x * y), x * y);
      const sx = x * tileW + wave;
      const sy = y * tileH;
      const sw = tileW;
      const sh = tileH;

      const sourcePixels = contextSource.getImageData(sx, sy, sw, sh);

      const dx = x * tileW;
      const dy = y * tileH;
      const dw = tileW;
      const dh = tileH;
      context.putImageData(sourcePixels, dx, dy);
    }
  }

  requestAnimationFrame(update);
};

const setup = () => {
  onResize();
  drawSource();
  requestAnimationFrame(update);
};

setup();
