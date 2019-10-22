let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  // createCanvas(640, 360);
  this.pendulum = new Pendulum(createVector(width / 2, 10), 125);
}

function draw() {
  this.pendulum.go();
}
