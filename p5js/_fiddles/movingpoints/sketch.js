let mover;

function setup() {
  createCanvas(window.innerWidth - 20, window.innerHeight - 20);
  // createCanvas(640, 360);
  this.sourcePoints = [
    new MovingPoint(50, 50, -0.01, 5),
    new MovingPoint(150, 110, 0.003, 10),
    new MovingPoint(250, 350, 0.009, 12),
    new MovingPoint(30, 450, -0.03, 8)
  ];
}

function draw() {
  clear();
  this.angle += 0.01;
  for (let i = 0; i < this.sourcePoints.length; i++) {
    const point = this.sourcePoints[i];
    point.update();
    // point.display();
  }
  stroke(255, 204, 0);
  strokeWeight(4);
  fill(255, 204, 0);
  for (let i = 0; i < this.sourcePoints.length - 1; i++) {
    const pointA = this.sourcePoints[i];
    const pointB = this.sourcePoints[i + 1];
    line(
      pointA.position.x,
      pointA.position.y,
      pointB.position.x,
      pointB.position.y
    );
  }
  const startPoint = this.sourcePoints[0];
  const endPoint = this.sourcePoints[this.sourcePoints.length - 1];
  line(
    endPoint.position.x,
    endPoint.position.y,
    startPoint.position.x,
    startPoint.position.y
  );
}
