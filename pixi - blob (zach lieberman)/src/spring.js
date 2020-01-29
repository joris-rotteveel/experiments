export default class Spring {
  constructor(particleA, particleB) {
    this.particleA = particleA;
    this.particleB = particleB;
    this.distance = 0;
    this.springiness = 0;
  }

  update = () => {
    if (!this.particleA || !this.particleB) {
      console.error("no particles defined");
      return;
    }

    const pta = this.particleA.pos.clone();
    const ptb = this.particleB.pos.clone();

    const theirDistance = pta.distance(ptb);
    const springForce = this.springiness * (this.distance - theirDistance);
    const frcToAdd = pta
      .subtract(ptb, true)
      .normalize()
      .multiply(springForce);

    this.particleA.addForce(frcToAdd.x, frcToAdd.y);
    this.particleB.addForce(-frcToAdd.x, -frcToAdd.y);
  };
}
