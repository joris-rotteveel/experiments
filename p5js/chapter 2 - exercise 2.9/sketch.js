let mover;

function setup() {
  // createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  createCanvas(640, 360);

  this.movers = [];
  this.attractors = [];
  var amount = 1;

  for (var i = 0; i < amount; i++) {
    this.addMover(1, 400, 50);
  }

  this.addAttractor(20, width / 2, height / 2);
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
  // this.addMover(random(1, 5), e.clientX, e.clientY);
  this.addAttractor(20, e.clientX, e.clientY);
}
function mouseReleased() {
  this.mouseDown = false;
}

function draw() {
  background(51);

  for (var i = 0; i < this.movers.length; i++) {
    var mover = this.movers[i];

    for (var j = 0; j < this.attractors.length; j++) {
      const attractor = this.attractors[j];
      attractor.display();
      mover.applyForce(attractor.attract(mover));
    }

    mover.update();
    mover.display();
  }
}
