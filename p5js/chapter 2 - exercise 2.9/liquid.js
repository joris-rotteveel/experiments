class Liquid {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.drag=0.1;
  }

  contains(position) {
    return (
      position.x > this.x &&
      position.x < this.x + this.width &&
      position.y > this.y &&
      position.y < this.y + this.height
    );
  }

  display() {
    stroke(0);
    fill(175);
    rect(this.x, this.y, this.width, this.height);
  }
}
