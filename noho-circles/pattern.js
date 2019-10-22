class Pattern {
  constructor({ radius, x, y }) {
    this.initialPosition = createVector(x, y);
    this.position = createVector(x, y);
    this.end = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.radius = radius;
    this.mass = 1;
  }

  applyForce(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  drawCircle() {
    const mouse = createVector(mouseX, mouseY);
    const distanceToMouse = p5.Vector.sub(mouse, this.position).mag();
    const maxDistance = 1500;
    const maxRadius = this.radius * 1.3;
    const distancePercentage = distanceToMouse / maxDistance;

    const radius = Math.max(
      this.radius / 2,
      maxRadius * (1 - distancePercentage)
    );

    push();
    translate(this.position);
    const rgb = 23; // 33 * (1 - distancePercentage);
    fill(rgb, rgb, rgb);
    stroke(0);
    strokeWeight(0);
    ellipse(0, 0, radius, radius);
    pop();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    push();
    translate(this.position);
    strokeWeight(2);
    stroke(255, 255, 0);

    // const mouse = createVector(mouseX, mouseY);
    // const distanceToMouse = p5.Vector.sub(mouse, this.position).mag();
    // const maxDistance = 100;
    // const distancePercentage = Math.max(0, distanceToMouse / maxDistance);

    // const widthOfTriangle = 20; //* (1- distancePercentage);
    // const heightOfTriangle = 20; //* (1- distancePercentage);

    // const strength = Math.max(0, 20 * (1 - distancePercentage));
    // this.centerPoint = createVector(widthOfTriangle / 2, heightOfTriangle);
    // this.top = p5.Vector.add(this.centerPoint, createVector(0, -strength));
    // this.left = p5.Vector.add(
    //   this.centerPoint,
    //   createVector(-strength, strength)
    // );
    // this.right = p5.Vector.add(
    //   this.centerPoint,
    //   createVector(strength, strength)
    // );

    // // draw the |
    // line(this.centerPoint.x, this.centerPoint.y, this.top.x, this.top.y);
    // //draw the /
    // line(this.centerPoint.x, this.centerPoint.y, this.left.x, this.left.y);
    // //draw the \
    // line(this.centerPoint.x, this.centerPoint.y, this.right.x, this.right.y);

    pop();
  }
}
