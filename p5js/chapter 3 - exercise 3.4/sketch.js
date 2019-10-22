let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  // createCanvas(640, 360);
  this.theta = 0;
  this.radius = 30;
}

function draw() {
  const size = 10;
  const x = this.radius * cos(this.theta);
  const y = this.radius * sin(this.theta);
  fill(0);
  ellipse(width / 2 + x, height / 2 + y, size, size);

  this.theta += 0.1;
  this.radius += 0.21;
}
