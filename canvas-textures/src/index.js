import './index.css';
import { TweenLite } from 'gsap';
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let sprites = [];

document.body.appendChild(canvas);

const resizeCanvas = () => {
  dpi_adjust();
  if (sprites.length > 0) {
    createGrid(sprites[0].image);
  }
};

const createGrid = image => {
  sprites = [];

  // edit these values according to your image and if you'd want padding

  const patternWidth = 36*window.devicePixelRatio;
  const patternHeight = 15*window.devicePixelRatio;

  const rows = Math.ceil((window.innerHeight*window.devicePixelRatio) / patternHeight);
  const cols = Math.ceil((window.innerWidth *window.devicePixelRatio)/ patternWidth);

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const xpos = col * patternWidth;
      const ypos = row * patternHeight;
      const sprite = {
        x: Math.round(xpos),
        y: Math.round(ypos),
        image,
        alpha: 0
      };

      const time = Math.random() * 2;
      const delay = Math.random();
      TweenLite.to(sprite, time, {
        alpha: 1,
        delay: delay
      });
      sprites.push(sprite);
    }
  }
};

const loadPattern = () => {
  const img = new Image();
  img.onload = () => {
    createGrid(img);
  };
  img.src =
    "http://goodoil.testing.org.nz/wp-content/themes/goodoil/r/img/good2x.png";
};

const dpi_adjust = () => {
  const dpi = window.devicePixelRatio;

  //too expensive
  const style_height =+getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);// window.innerHeight;
  const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);//window.innerWidth;


  // const style_height = window.innerHeight;
  // const style_width = window.innerWidth;

  canvas.setAttribute("height", style_height * dpi);
  canvas.setAttribute("width", style_width * dpi);
};

const animate = () => {
  // dpi_adjust();
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.beginPath();
  // ctx.fillRect(25, 50, 25, 25);
  // ctx.beginPath();
  // ctx.arc(500, 50, 300, 0, 2 * Math.PI);
  // ctx.stroke();
  // ctx.font = "30px Arial";
  // ctx.fillText("Hello World", 10, 50);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < sprites.length; index++) {
    const { image, x, y, alpha } = sprites[index];
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    const d=window.devicePixelRatio>1?1:2
    ctx.drawImage(image, x, y, image.width/d, image.height/d);
  }
  window.requestAnimationFrame(animate);
};

const init = () => {
  window.addEventListener("resize", resizeCanvas, false);
  resizeCanvas();
  loadPattern();
  //this will start the animation
  requestAnimationFrame(animate);
};

init();


