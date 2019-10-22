function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  this.particles = [
    new Pattern({
      radius: 30,
      x: 100,
      y: 100
    })
  ];

  this.particles = createGrid();
  this.img = loadImage("assets/chair.png");
}
function createGrid() {
  const points = [];
  const spacing = 10;
  const radius = 30;

  this.cols = Math.round(height / (radius + spacing));
  this.rows = Math.round(width / (radius + spacing));

  for (let x = 0; x <= this.rows; x++) {
    for (let y = 0; y <= this.cols; y++) {
      points.push(
        new Pattern({
          radius: radius,
          x: x * (radius + spacing),
          y: y * (radius + spacing)
        })
      );
    }
  }
  return points;
}

function mouseReleased(e) {}

function draw() {
  // put drawing code here
  clear();
  background(13, 13, 13);

  for (let index = 0; index < this.particles.length; index++) {
    const particle = this.particles[index];

    particle.update();
    particle.display();
  }
  const scale = 2;
  image(
    this.img,
    width / 2 - (this.img.width * scale) / 2,
    0,
    this.img.width * scale,
    this.img.height * scale
  );
}
