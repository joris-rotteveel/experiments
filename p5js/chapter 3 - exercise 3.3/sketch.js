let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  // createCanvas(640, 360);

  this.movers = [];

  var amount = 1;

  for (var i = 0; i < amount; i++) {
    this.addMover(random(1, 5), random(0, 300), random(0, 300));
  }
}
function addAttractor(m, x, y) {
  const attractor = new Attractor(m, x, y);
  this.attractors.push(attractor);
}

function addMover(mass, x, y) {
  var mover = new Mover(mass, x, y);
  this.movers.push(mover);
}

function mousePressed(e) {
  this.addMover(random(1, 5), 0, 0);
}
function mouseReleased() {
  this.mouseDown = false;
}

function draw() {
  background(51);

  const attractor = createVector(pmouseX, pmouseY);

  for (var i = 0; i < this.movers.length; i++) {
    var moverA = this.movers[i];

    var force = p5.Vector.sub(moverA.position, attractor);
    var strength = 0.2;
    force.normalize();
    force.mult(-strength);

    moverA.applyForce(force);

    moverA.checkEdges();
    moverA.update();
    moverA.display();
  }
}
