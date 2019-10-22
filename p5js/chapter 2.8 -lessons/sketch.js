let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);

  this.movers = [];
  var amount = 10;

  for (var i = 0; i < amount; i++) {
    this.addMover(random(1, 5), random(10, width - 10), random(1, 10));
  }

  this.liquid = new Liquid(0, height - height / 3, width, height / 3);
  this.liquid2 = new Liquid(0, 200, 200, 100);
}

function addMover(mass, x, y) {
  var mover = new Mover(mass, x, y);
  this.movers.push(mover);
}

function mousePressed(e) {
  console.log(e);
  this.addMover(3, e.clientX, e.clientY);
}
function mouseReleased() {
  this.mouseDown = false;
}

function draw() {
  background(51);
  this.liquid.display();
  this.liquid2.display();

  var wind = createVector(0.001, 0);

  for (var i = 0; i < this.movers.length; i++) {
    var mover = this.movers[i];
    var gravity = createVector(0, 0.1 * mover.mass);
    var frictionFactor = 0.01;
    const normal = 1;
    const frictionMagnitude = frictionFactor * normal;

    var friction = mover.velocity.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(frictionMagnitude);

    if (this.liquid2.contains(mover.position)) {
      mover.drag(this.liquid2.drag);
     
    }
    if (this.liquid.contains(mover.position)) {
      mover.drag(this.liquid.drag);
     
    }
    mover.applyForce(friction);
    mover.applyForce(wind);
    mover.applyForce(gravity);
    mover.update();
    mover.display();
    mover.checkEdges();
  }
}
