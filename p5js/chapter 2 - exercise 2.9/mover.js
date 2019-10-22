class Mover {
  constructor(mass, x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(1,0);
    this.acceleration = createVector(0,0);
    this.mass = mass;
  }

  applyForce(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  drag(coefficientOfDrag) {
    //apply drag. speed squared * coeffiecient of drag * opposite direction of velocity
    const speed = this.velocity.mag();
    var dragMagnitude = speed * speed * coefficientOfDrag;
    var drag = this.velocity.copy();
    drag.mult(-1);
    drag.normalize();
    drag.mult(dragMagnitude);
    this.applyForce(drag);
  }

  checkEdges() {
    const dampening = -0.98;
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= dampening;
    } else if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x *= dampening;
    }
    if (this.position.y > height) {
      this.position.y = height;
      this.velocity.y *= dampening;
    } else if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y *= dampening;
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    stroke(0);
    strokeWeight(2);
    fill(127);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
  }
}
