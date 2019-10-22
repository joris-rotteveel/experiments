let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  this.anchorPointA = new DragPoint(189, 1, 0, 0);
  this.anchorPointB = new DragPoint(797, 263, 0, 0);
  this.controlPointA = new DragPoint(567, 49, 0.01, 20);
  this.controlPointB = new DragPoint(507, 313, 0.01, 20);
  this.showControls=true
  this.points = [
    this.anchorPointA,
    this.anchorPointB,
    this.controlPointA,
    this.controlPointB
  ];

  this.c1 = color(204, 102, 0);
  this.c2 = color(0, 102, 153);
}

function mousePressed() {
  for (i = 0; i < this.points.length; i++) {
    this.points[i].onPress(mouseX, mouseY);
  }
  console.log("------");
  console.log(
    "this.anchorPointA = new DragPoint(" +
      this.anchorPointA.position.x +
      "," +
      this.anchorPointA.position.y +
      ");",
    "this.anchorPointB = new DragPoint(" +
      this.anchorPointB.position.x +
      "," +
      this.anchorPointB.position.y +
      ");",
    "this.controlPointA = new DragPoint(" +
      this.controlPointA.position.x +
      "," +
      this.controlPointA.position.y +
      ");",
    "this.controlPointB = new DragPoint(" +
      this.controlPointB.position.x +
      "," +
      this.controlPointB.position.y +
      ");"
  );
  console.log("------\n\n\n");
}

function mouseReleased() {
  for (i = 0; i < this.points.length; i++) {
    this.points[i].onRelease();
  }
}

function draw() {
  clear();
  for (i = 0; i < this.points.length; i++) {
    this.points[i].update();
    if (this.showControls) {
      this.points[i].display();
    }
  }
  // setGradient(50, 90, 540, 80, this.c1, this.c2);

  if (this.showControls) {
    stroke(255, 102, 0);
    line(
      this.anchorPointA.position.x,
      this.anchorPointA.position.y,
      this.controlPointA.position.x,
      this.controlPointA.position.y
    );
    line(
      this.controlPointB.position.x,
      this.controlPointB.position.y,
      this.anchorPointB.position.x,
      this.anchorPointB.position.y
    );
  }
  noFill();
  stroke(0, 0, 0);

  bezier(
    this.anchorPointA.position.x,
    this.anchorPointA.position.y,
    this.controlPointA.position.x,
    this.controlPointA.position.y,
    this.controlPointB.position.x,
    this.controlPointB.position.y,
    this.anchorPointB.position.x,
    this.anchorPointB.position.y
  );
  line(
    this.anchorPointB.position.x,
    this.anchorPointB.position.y,
    this.anchorPointB.position.x,
    this.anchorPointA.position.y
  );
  line(this.anchorPointB.position.x,
    this.anchorPointA.position.y,
    this.anchorPointA.position.x,
    this.anchorPointA.position.y,
  )
}
