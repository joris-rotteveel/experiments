class Circle {
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

  drawLine() {
    push();
    strokeWeight(2);
    translate(this.position);
    const mouse = createVector(mouseX, mouseY);
    const distanceToMouse = p5.Vector.sub(mouse, this.position).mag();
    const maxDistance = 100;
    const distancePercentage = distanceToMouse / maxDistance;
    const end = p5.Vector.sub(mouse, this.position);
    const rgb = 70 * (1 - distancePercentage);
    const ease = 0.1;
    
    end.normalize();
    end.mult(Math.max(50, Math.min(1, maxDistance * (1 - distancePercentage))));
    end.mult(-1);
    this.end.x += (end.x - this.end.x) * ease;
    this.end.y += (end.y - this.end.y) * ease;

    // stroke(rgb);
    stroke(0,200,0);
    // line(0, 0, this.end.x, this.end.y);
    pop();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display(isCircle) {
    if (isCircle) {
      this.drawCircle();
    } else {
      this.drawLine();
    }
  }
}
