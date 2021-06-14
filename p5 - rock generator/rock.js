class Rock {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.radius = config.radius;
    this.diameter = this.radius * 2;
  }
  drawShadow = function (angleOfSun) {
    const cosine = cos(angleOfSun);
    const sine = sin(angleOfSun);
    const shadowDistance = this.radius * 0.05;
    const shadowScale = 1;

    //the rock shadow
    fill(60, 60, 60);
    noStroke();
    ellipse(
      this.x - cosine * shadowDistance,
      this.y - sine * shadowDistance,
      this.diameter * shadowScale,
      this.diameter * shadowScale
    );

    // dbug line to sun
    stroke(0);
    line(this.x, this.y, this.x + cosine * 100, this.y + sine * 100);
  };

  draw = function () {
    //the rock itself
    fill(100, 100, 100);

    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);

    stroke(0xff0000);
    //left bottom --> right bottom
    // https://editor.p5js.org/golan/sketches/P-NxlPAOa
    const bl = { x: this.x - this.radius, y: this.y + this.radius };
    const br = { x: this.x + this.radius, y: this.y + this.radius };
    const top = { x: this.x, y: this.y - this.radius };
    line(bl.x, bl.y, br.x, br.y);
    line(br.x, br.y, top.x, top.y);
    line(top.x, top.y, bl.x, bl.y);
  };
}
