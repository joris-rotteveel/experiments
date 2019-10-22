const RADIUS_MIN = 80;
const RADIUS_MAX = 150;
const OPEN = 2;
const CLOSED = 3;
class Hand {
  constructor() {
    this.G = 1;
    this.mass = 20;
    this.position = createVector();
    this.target = createVector();
    this.setState = this.setState.bind(this);
    this.setState(-1);
  }

  madeCloseToOpengesture() {
    const MIN_CLOSE_DURATION = 0.6 * 1000;
    return this.closeDuration > MIN_CLOSE_DURATION;
  }

  resetGesture() {
    this.closeDuration = 0;
    this.closeTimeStart = 0;
  }

  isOpen() {
    return this.state === OPEN;
  }
  isClosed() {
    return this.state === CLOSED;
  }

  setState(state) {
    if (this.state !== state) {
      this.timeOut = null;
      const prevState = this.state;
      this.state = state;
      // 3 = closed
      // 2= open
      this.state === CLOSED ? RADIUS_MIN : RADIUS_MAX;
      if (state === CLOSED) {
        this.closeDuration = 0;
        this.closeTimeStart = Date.now();
      } else if (state === OPEN) {
        this.closeDuration =
          prevState === CLOSED ? Date.now() - this.closeTimeStart : 0;
      }
    }
    clearTimeout(this.timeOut);
  }
  setPos(pos) {
    this.target.x = pos.x;
    this.target.y = pos.y;
  }

  calculateAttraction(particle) {
    // Calculate direction of force
    let force = p5.Vector.sub(this.position, particle.position);
    // Distance between objects
    let distance = force.mag();
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, 5, 10);
    // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    force.normalize();
    // Calculate gravitional force magnitude
    let strength = (this.G * this.mass * particle.mass) / (distance * distance);
    // Get force vector --> magnitude * direction
    force.mult(strength);
    return force;
  }

  update() {
    this.position.x += (this.target.x - this.position.x) * 0.09;
    this.position.y += (this.target.y - this.position.y) * 0.09;
  }
}
