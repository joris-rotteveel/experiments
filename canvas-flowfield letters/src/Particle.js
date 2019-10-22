class Particle {
  constructor(sketch, scl, cols) {
    this.sketch = sketch;
    this.alpha = 1;
    this.scl = scl;
    this.cols = cols;
    this.pos = this.sketch.createVector(0, 0);
    this.vel = this.sketch.createVector(0, 0);
    this.acc = this.sketch.createVector(0, 0);
    this.maxspeed = 4;
    this.colour = "#ff0000";
    this.prevPos = this.pos.copy();
  }

  update = () => {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  follow = vectors => {
    var x = this.sketch.floor(this.pos.x / this.scl);
    var y = this.sketch.floor(this.pos.y / this.scl);
    var index = x + y * this.cols;
    var force = vectors[index];

    force=this.sketch.createVector(0, 3)
    this.applyForce(force);
  };

  applyForce = force => {
    this.acc.add(force);
  };

  setColor = color => {
    this.colour = color;
  };
  setAlpha = alpha => {
    this.alpha = alpha;
  };

  colorAlpha = (aColor, alpha) => {
    var c = this.sketch.color(aColor);
    return this.sketch.color(
      "rgba(" +
        [
          this.sketch.red(c),
          this.sketch.green(c),
          this.sketch.blue(c),
          alpha
        ].join(",") +
        ")"
    );
  };
  show = () => {
    this.sketch.stroke(this.colorAlpha(this.colour, this.alpha));

    this.sketch.strokeWeight(1);
    // this.sketch.circle(this.pos.x, this.pos.y,10);
    this.sketch.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  };

  updatePrev = () => {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };

  reset = () => {
    this.vel = this.sketch.createVector(0, 0);
    this.acc = this.sketch.createVector(0, 0);
    this.pos.x =this.sketch.random(this.sketch.width);
    this.pos.y = 100;//this.sketch.random(this.sketch.height);
    this.prevPos = this.pos.copy();
  };

  edges = () => {
    if (this.pos.x > this.sketch.width) {
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.reset();
      this.updatePrev();
    }
    if (this.pos.y > this.sketch.height) {
      this.reset();
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.reset();
      this.updatePrev();
    }
  };
}

export default Particle;
