import "./index.css";
let angle = 0;

let screenRect;

const canvasElementSource = document.getElementById("source");
const contextSource = canvasElementSource.getContext("2d");
const canvasElement = document.getElementById("app");
const context = canvasElement.getContext("2d");

const fontFamily = '"Helvetica"';
const letter = "yard";

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

const update = delta => {
  const { width, height } = screenRect;
  angle += 0.1;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  //draw letter to seperate canvas
  //copy pixels rect from that canvas onto this canvas
  //profit

  const tilesX = 12;
  const tilesY = 12;

  const tileW = Math.ceil(width / tilesX);
  const tileH = Math.ceil(height / tilesY);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const wave = Math.sin(angle + x * y * 0.08) * 50;
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
  const { width, height } = screenRect;
  contextSource.fillStyle = "#000000";
  contextSource.fillRect(0, 0, width, height);

  
 
  contextSource.fillStyle = "#111111";
  contextSource.beginPath();
  contextSource.arc(width / 2, height / 2, 250, 0, 2 * Math.PI);
  contextSource.fill();
  contextSource.stroke();

  contextSource.fillStyle = "#FFFFFF";
  contextSource.font = `${400}px ${fontFamily}`;
  contextSource.textAlign = "center";
  contextSource.textBaseline = "middle";
  contextSource.fillText(letter, width / 2, height / 2);
  requestAnimationFrame(update);
};

setup();
