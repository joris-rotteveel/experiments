class DragPoint {
  constructor(x, y, speed, radius) {
    this.speedX = speed;
    this.speedY = speed * 0.5;
    this.radius = radius;
    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
    this.basePosition = createVector(x, y);
    this.position = createVector();
  }

  onPress(px, py) {
    const x = this.position.x;
    const y = this.position.y;
    const w = 20;
    const h = 20;
    if (px > x && px < x + w && py > y && py < y + h) {
      this.dragging = true;
      this.offsetX = x - px;
      this.offsetY = y - py;
    }
  }

  onRelease() {
    this.dragging = false;
  }

  update() {
    if (this.dragging) {
      this.position.x = mouseX + this.offsetX;
      this.position.y = mouseY + this.offsetY;
    } else {
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
  }

  display() {
    push();
    fill("red");
    rect(this.position.x, this.position.y, 20, 20);
    pop();
  }
}
