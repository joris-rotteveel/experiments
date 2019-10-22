class Pendulum {
  constructor(origin, radius) {
    this.radius = radius;
    this.origin = origin.copy();
    this.position = createVector();
    this.angle = PI / 3;
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.damping = 0.995;
  }

  go() {
    this.update();
    this.display();
  }
  update() {
    const gravity = 0.4;
    //see page 128
    this.aAcceleration = ((-1 * gravity) / this.radius) * sin(this.angle);

    this.aVelocity += this.aAcceleration;
    this.aVelocity *= this.damping;
    this.angle += this.aVelocity;
  }

  display() {
    this.position.set(
      this.radius * Math.sin(this.angle),
      this.radius * Math.cos(this.angle),0
    );

    this.position.add(this.origin);

    stroke(0);
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    ellipseMode(CENTER);
    fill(175);
    ellipse(this.position.x, this.position.y, 16, 16);
  }
}
