import "./index.css";
let angle = 0;

let screenRect;

const canvasElementSource = document.getElementById("source");
const contextSource = canvasElementSource.getContext("2d");
const canvasElement = document.getElementById("app");
const context = canvasElement.getContext("2d");

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

  contextSource.fillStyle = "#FFFFFF";

  contextSource.font = `${400}px ${fontFamily}`;
  contextSource.textAlign = "center";
  contextSource.textBaseline = "middle";
  contextSource.fillText("KLIM", width / 2, height / 2);
  contextSource.restore();
};

const update = delta => {
  const { width, height } = screenRect;
  angle += 0.01;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
  drawSource();

  //draw letter to seperate canvas
  //copy pixels rect from that canvas onto this canvas
  //profit

  const tilesX = 1; //+Math.abs(Math.cos(angle*0.3)*6);
  const tilesY = 95;
  const tileW = Math.ceil(width / tilesX);
  const tileH = Math.ceil(height / tilesY);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const sin = Math.cos(angle + y / 2);
      const wave = sin * (60 * (1 + y / 50)) * 0.25;

      const sx = x * tileW + wave;
      const sy = y * tileH; //+ wave * 0.4;
      const sw = tileW;
      const sh = tileH;

      const sourcePixels = contextSource.getImageData(sx, sy, sw, sh);

      const dx = x * tileW;
      const dy = y * tileH;

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
