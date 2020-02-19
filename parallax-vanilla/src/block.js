import lerp from "lerp";
import gsap from "gsap";

export default class Block {
  constructor(element, { sectionHeight }) {
    this.element = element;
    this.offset = Number(element.dataset.blockOffset);
    this.factor = Number(element.dataset.blockFactor);

    this.offset = (sectionHeight - sectionHeight / this.factor) * this.offset;

    this.pos = 0;
  }

  update = top => {
    this.pos = lerp(this.pos, (top - this.offset) * this.factor, 0.1);

    gsap.set(this.element, {
      y: -this.pos
    });
  };
}
