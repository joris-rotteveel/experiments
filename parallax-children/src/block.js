import lerp from "lerp";
import gsap from "gsap";

export default class Block {
  constructor(element, { sectionHeight }) {
    this.element = element;
    this.offset = Number(element.dataset.blockOffset);
    this.factor = Number(element.dataset.blockFactor);

    this.parentOffset =
      (sectionHeight - sectionHeight / this.factor) * this.offset;

    this.child = this.element.querySelector("[data-block-content]");

    this.pos = 0;
    this.posChild = 0;
  }

  update = (top, scrollPct) => {
    // this.pos = lerp(this.pos, (top - this.parentOffset) * this.factor, 0.1);
    this.pos = lerp(this.pos, top, 1);
    this.posChild = lerp(
      this.posChild,
      (top - this.parentOffset) * this.factor,
      0.1
    );

    gsap.set(this.element, {
      y: -this.pos
    });

    gsap.set(this.child, {
      y: this.pos - this.posChild
    });
  };
}
