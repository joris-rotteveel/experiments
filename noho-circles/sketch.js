function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  this.particles = createGrid();
  this.img = loadImage("assets/chair.png");
}
function createGrid() {
  const points = [];
  const spacing = 10;
  const radius = 30;

  this.cols = Math.round(height / (radius + spacing));
  this.rows = Math.round(width / (radius + spacing));

  for (let x = 0; x <= this.rows; x++) {
    for (let y = 0; y <= this.cols; y++) {
      points.push(
        new Circle({
          radius: radius,
          x: x * (radius + spacing),
          y: y * (radius + spacing)
        })
      );
    }
  }
  return points;
}

function mouseReleased(e) {}

function draw() {
  // put drawing code here
  clear();
  background(13, 13, 13);

  for (let index = 0; index < this.particles.length; index++) {
    const particle = this.particles[index];

    particle.update();
    particle.display(false);
  }
  console.log(this.cols);
  for (let index = 0; index < this.particles.length; index++) {
    const particle = this.particles[index];
    //let's create a grid
    // A ------- B
    // |         |
    // |         |
    // C ------- D
    const nextCol = index + this.cols;
    if (nextCol < this.particles.length - 1) {
      const a = particle;
      const b = this.particles[nextCol];
      push();
      strokeWeight(2);
      stroke(255, 000, 000);
      translate(a.position);
      const mouse = createVector(mouseX, mouseY);
      const distanceToMouse = p5.Vector.sub(mouse, a.position).mag();
      const maxDistance = 100;
      const distancePercentage = Math.max(0, distanceToMouse / maxDistance);

      const widthOfTriangle = 20; //* (1- distancePercentage);
      const heightOfTriangle = 20; //* (1- distancePercentage);

      const strength = Math.max(0, 20 * (1 - distancePercentage));
      const centerPoint = createVector(b.end.x, b.end.y);
      const top = createVector(
        centerPoint.x,
        centerPoint.y - strength
      );
      left = p5.Vector.add(
        centerPoint,
        createVector(-strength, strength)
      );
      const right = p5.Vector.add(
        centerPoint,
        createVector(strength, strength)
      );

      // draw the |
      line(centerPoint.x, centerPoint.y, top.x, top.y);
      //draw the /
      line(centerPoint.x, centerPoint.y, left.x, left.y);
      //draw the \
      line(centerPoint.x, centerPoint.y, right.x, right.y);

      // line(a.end.x, a.end.y, b.end.x, b.end.y);
      // line(
      //   a.position.x + a.end.x,
      //   a.position.y + a.end.y,
      //   b.position.x + b.end.x,
      //   b.position.y + b.end.y
      // );

      pop();
    }
  }
  const scale = 2;
  image(
    this.img,
    width / 2 - (this.img.width * scale) / 2,
    0,
    this.img.width * scale,
    this.img.height * scale
  );
}
