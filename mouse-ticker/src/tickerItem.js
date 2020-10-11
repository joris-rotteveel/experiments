import gsap from "gsap";

export const roundToMultiple = (currentValue, nearest) => {
  return Math.ceil(currentValue / nearest) * nearest;
};

export class TickerItem {
  constructor(el) {
    this.onRollOver = this.onRollOver.bind(this);
    this.onRollOut = this.onRollOut.bind(this);

    this.el = el;
    this.original = this.el.querySelector(".js-original");
    this.originalWidth = this.original.getBoundingClientRect().width;
    this.copyContainer = this.el.querySelector(".js-ticker-copies");
    this.copiesWidth = this.copyContainer.getBoundingClientRect().width;
    this.textValue = el.textContent;
    this.copySpans = this.copyContainer.querySelectorAll(".js-copy");

    gsap.set(this.copyContainer, { autoAlpha: 0 });

    this.el.addEventListener("mouseover", this.onRollOver);
    this.el.addEventListener("mouseout", this.onRollOut);

    this.animationValues = { x: 0 };

    this.onRollOver();
  }

  onRollOver() {
    console.log("over");

    return;

    gsap.killTweensOf(this.animationValues);
    gsap.killTweensOf(this.copyContainer);
    gsap.killTweensOf(this.original);
    const padding = 40;
    const xpos = window.innerWidth / 2 - this.originalWidth / 2 - padding;
    // gsap.set(this.original, { alpha: 0 });
    gsap.set(this.copyContainer, {
      autoAlpha: 1,
      x: xpos - this.originalWidth,
    });
    gsap.set(this.animationValues, { x: xpos });
    gsap.set(this.copySpans, { autoAlpha: 1 });
    return;
    gsap.to(this.animationValues, {
      x: -2 * this.originalWidth,
      repeat: -1,
      duration: 1,
      ease: "none",
      onUpdate: () => {
        gsap.set(this.copyContainer, { x: this.animationValues.x });
      },
    });
  }

  onRollOut() {
    console.log("out");

    return;
    gsap.killTweensOf(this.animationValues);
    gsap.killTweensOf(this.copyContainer);
    gsap.killTweensOf(this.original);
    // snap to closest multiple of this.originalWidth

    const currentOffset = this.animationValues.x;
    const amountFit = currentOffset / this.originalWidth;
    const selectedIndex = Math.abs(Math.floor(amountFit));
    const endPos = -selectedIndex * this.originalWidth;

    this.copySpans.forEach((span, index) => {
      if (index !== selectedIndex) {
        gsap.to(span, { duration: 0.1, autoAlpha: 0 });
      }
    });

    gsap.to(this.animationValues, {
      x: endPos,
      duration: 0.25,
      onUpdate: () => {
        gsap.set(this.copyContainer, { x: this.animationValues.x });
      },
      onComplete: () => {
        gsap.set(this.animationValues, { x: 0 });
        gsap.set(this.original, { alpha: 1 });
        gsap.set(this.copySpans, { alpha: 0 });
      },
    });
  }
}
