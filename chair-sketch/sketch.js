let startMouse;
let endMouse;

function setup() {
  // put setup code here
  this.chairs = [];
  createCanvas(window.innerWidth, window.innerHeight);
}

function mousePressed(e) {
  endMouse = null;
  startMouse = createVector(e.clientX, e.clientY);
  const chair = new Chair(1, startMouse.x, startMouse.y);
  this.chairs.push(chair);
}

function mouseReleased(e) {
  endMouse = createVector(e.clientX, e.clientY);
  //create a new chair @ end position
  const chair = this.chairs[this.chairs.length - 1];
  //apply force in the direction of the mouse
  const throwForce = p5.Vector.sub(endMouse, startMouse);
  const mag = throwForce.mag();
  const maxForce = 100;
  throwForce.normalize().mult(Math.min(maxForce, (mag / maxForce) * maxForce));

  chair.applyForce(throwForce);

  startMouse = null;
}

function draw() {
  // put drawing code here
  clear();
  if (startMouse) {
    line(startMouse.x, startMouse.y, mouseX, mouseY);
  }

  for (var i = 0; i < this.chairs.length; i++) {
    const mover = this.chairs[i];
    const frictionFactor = -0.21;
    const friction = mover.velocity.copy();

    friction.mult(frictionFactor);

    mover.applyForce(friction);
    mover.update();
    mover.display();
    mover.checkEdges();
  }
}
