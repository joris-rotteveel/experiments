class MovingPoint {
  constructor(x, y, speed, radius) {
    this.speedX = speed;
    this.speedY = speed * 0.5;
    this.radius = radius;
    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
    this.basePosition = createVector(x, y);
    this.position = createVector();
  }

  update() {
    this.position.x +=
      (this.basePosition.x +
        Math.cos(this.angleX) * this.radius -
        this.position.x) *
      0.05;
    this.position.y +=
      (this.basePosition.y +
        Math.sin(this.angleY) * this.radius -
        this.position.y) *
      0.05;
    this.angleX += this.speedX;
    this.angleY += this.speedY;
  }

  display() {
    stroke(0);
    strokeWeight(2);
    fill(127);
    push();
    translate(this.position.x, this.position.y);
    rectMode(CENTER);
    rect(0, 0, 10, 10);
    pop();
  }
}
