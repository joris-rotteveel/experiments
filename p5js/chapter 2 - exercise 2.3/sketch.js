let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  this.movers = [];
  var amount = 10;
  for (var i = 0; i < amount; i++) {
    var mover = new Mover(
      random(1, 5),
      random(10, width - 10),
      random(10, height - 10)
    );
    this.movers.push(mover);
  }
}
function mousePressed() {
  console.log("pressed");
  this.mouseDown = true;
}
function mouseReleased() {
  console.log("release");
  this.mouseDown = false;
}

function getDistance(moverPosition, position) {
  var distance = p5.Vector.dist(moverPosition, position);
  distance = constrain(distance, 1, 1000);
  return distance;
}

function draw() {
  background(51);

  var wind = createVector(0.001, 0);

  for (var i = 0; i < this.movers.length; i++) {
    var mover = this.movers[i];
    var gravity = createVector(0, 0.1 * mover.mass);
    var wallStrength = 20;

    var leftHandSide = createVector(
      wallStrength /
        this.getDistance(createVector(mover.position.x, 0), createVector(0, 0)),
      0
    );

    var rightHandSide = createVector(
      -wallStrength /
        this.getDistance(
          createVector(mover.position.x, 0),
          createVector(width, 0)
        ),
      0
    );

    var topSide = createVector(
      0,
      wallStrength /
        this.getDistance(createVector(0, mover.position.y), createVector(0, 0))
    );
    var bottomSide = createVector(
      0,
      -wallStrength /
        this.getDistance(
          createVector(0, mover.position.y),
          createVector(0, height)
        )
    );

    var frictionFactor = 0.01;
    const normal = 1;
    const frictionMagnitude = frictionFactor * normal;

    var friction = mover.velocity.copy();
    friction.mult(-1);
    friction.normalize();
    friction.mult(frictionMagnitude);

    if (this.mouseDown) {
      mover.applyForce(rightHandSide);
      mover.applyForce(leftHandSide);
      mover.applyForce(topSide);
      mover.applyForce(bottomSide);
    }
    mover.applyForce(friction);
    mover.applyForce(wind);
    mover.applyForce(gravity);
    mover.update();
    mover.display();
    mover.checkEdges();
  }
}
