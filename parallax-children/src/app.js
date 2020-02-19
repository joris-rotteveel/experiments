import gsap from "gsap";
import Block from "./block";

export default class App {
  constructor() {
    const blocks = [...document.querySelectorAll("[data-block]")];

    this.pages = blocks.length;
    this.sectionHeight = window.innerHeight;

    this.debugText = document.querySelector(".debug");

    this.scrollProxy = document.querySelector(".scrollArea");
    this.scrollProxy.addEventListener("scroll", () => {
      this.onScroll();
    });
    // setup scrollheight
    const scrollHeight = `${this.pages * 100}vh`;
    gsap.set("#scrollArea__height", { height: scrollHeight });

    //grab all the blocks
    this.blocks = blocks.map(
      element => new Block(element, { sectionHeight: this.sectionHeight })
    );
    this.scrollTop = this.scrollProxy.scrollTop;
    this.onScroll();
    this.update();
  }

  onScroll = () => {
    this.scrollTop = this.scrollProxy.scrollTop;
  };

  update = () => {
    window.scroll(0, 0);
    const pct =
      this.scrollTop / (this.pages * this.sectionHeight - window.innerHeight);

    this.debugText.innerHTML = `scroll: ${pct}%`;

    this.blocks.forEach(b => b.update(this.scrollTop, pct));
    requestAnimationFrame(() => {
      this.update();
    });
  };
}
