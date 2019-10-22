let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);

  this.movers = [];
  this.attractors = [];
  var amount = 10;


  for (var i = 0; i < amount; i++) {
    this.addMover(random(1,5), random(10, width - 10), random(1, 10));
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
  // this.addMover(random(1, 5), e.clientX, e.clientY);
  this.addAttractor(random(1,20), e.clientX, e.clientY);
}
function mouseReleased() {
  this.mouseDown = false;
}

function draw() {
  background(51);
  
  var wind = createVector(0.001, 0);

  for (var i = 0; i < this.movers.length; i++) {
    var mover = this.movers[i];
    var gravity = createVector(0, 0.1 * mover.mass);
    var airFriction = 0.01;
    
    for (var j = 0; j < this.attractors.length; j++) {
      const attractor = this.attractors[j];
      attractor.display();
      mover.applyForce(attractor.attract(mover));
    }
    mover.drag(airFriction);
    mover.applyForce(wind);
    // mover.applyForce(gravity);
    mover.update();
    mover.display();
    // mover.checkEdges();
  }
}
