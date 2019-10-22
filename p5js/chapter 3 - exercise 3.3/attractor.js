class Attractor {
  constructor(mass, x, y) {
    this.position = createVector(x, y);
    this.mass = mass;
  }
  
  getGravitationalForce(mover) {
    const G = 1;
    var force = p5.Vector.sub(this.position, mover.position);
    let distance = force.mag();
    distance = constrain(distance, 5, 25);
    force.normalize();
    const strength = (G * this.mass * mover.mass) / (distance * distance);
    force.mult(strength);

    return force;
  }

  display() {
    stroke(0);
    fill(175, 200);
    rect(this.position.x, this.position.y, this.mass * 2, this.mass * 2);
  }
}
