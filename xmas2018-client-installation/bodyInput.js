class BodyInput {
  constructor(id) {
    this.id = id;
    this.leftPos = createVector();
    this.rightPos = createVector();
    this.left = new Hand();
    this.right = new Hand();
  }

  setHands(left, right) {
    this.left.setPos(left.position);
    this.right.setPos(right.position);

    this.left.setState(left.state);
    this.right.setState(right.state);
  }
  update() {
    this.left.update();
    this.right.update();
  }
}
