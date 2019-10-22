class Particle {
  constructor({ texture, x = 0, y = 0, tint }) {
    this.graphic = PIXI.Sprite.fromImage(texture);
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.circleForce = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.graphic.anchor.set(0.5);
    this.graphic.tint =this.initialTint= Math.random() > 0.95 ? 0x9e9e9e : 0x2f2f2f; //0x357959 ;
    if (tint) this.graphic.tint = tint;
    this.scale = 1;
    this.mass = 24;
    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
    this.speedX = 0.01 + Math.random() * 0.02;
    this.speedY = 0.01 + Math.random() * 0.02;
    if (Math.random() > 0.5) this.speedX *= -1;
    if (Math.random() > 0.5) this.speedY *= -1;
    // Arbitrary damping to simulate friction / drag
    this.damping = 0.99 + Math.random() * 0.01;
    this.ease = 0.3 + Math.random() * 0.4;

    this.followRadius = Math.random() * 100;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * (Math.random() < 0.5 ? -0.03 : 0.03);

    this.reset = this.reset.bind(this);
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.mult(this.damping);

    this.position.add(this.velocity);
    this.acceleration.mult(0);

    this.graphic.x = this.position.x;
    this.graphic.y = this.position.y;

    this.graphic.alpha = this.alpha;
    const scaleRange = this.initialScale * 1.2 - this.initialScale;
    this.scale = this.initialScale + Math.cos(this.angle) * scaleRange;

    this.angle += this.speed;
    this.graphic.scale.set(this.scale);
  }

  setPos(point) {
    this.position.x = point.x;
    this.position.y = point.y;
  }

  destroy() {
    this.graphic.destroy();
    this.graphic = null;
  }

  enableLogging() {
    this.log = true;
  }

  movedFromInitialPos() {
    return this.hasMoved;
  }

  followHand(hand) {
    if (hand) {
      this.hasMoved = true;
      this.graphic.tint = 0xffffff;
      this.scale = this.initialScale * 0.5;
    }

    this.hand = hand;
  }

  reset() {
    this.followHand(null);
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    // this.position.x = this.initialPosition.x;
    // this.position.y = this.initialPosition.y;
  }

  set x(value) {
    this.position.x = value;
  }
  get x() {
    return this.position.x;
  }

  set y(value) {
    this.position.y = value;
  }
  get y() {
    return this.position.y;
  }

  setBase({ x, y, scale, alpha, radius }) {
    this.hasMoved = false;
    this.graphic.tint =this.initialTint
    this.followHand(null);
    this.initialScale = scale;
    this.radius = radius;
    this.alpha = alpha;
    this.initialAlpha = alpha;
    ///
    this.initialPosition = createVector(x, y);
    // this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.radius = radius;
    this.mass = this.initialScale * 30;
  }
}
