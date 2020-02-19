import gsap from "gsap";
import Block from "./block";

export default class App {
  constructor() {
    const blocks = [...document.querySelectorAll("[data-block]")];

    this.pages = blocks.length;
    this.sections = blocks.length;
    this.sectionHeight = window.innerHeight;

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
    this.update();
  }

  onScroll = () => {
    this.scrollTop = this.scrollProxy.scrollTop;
    const pct =
      this.scrollTop / (this.pages * this.sectionHeight - window.innerHeight);

    console.log(pct);
  };

  update = () => {
    window.scroll(0, 0);

    this.blocks.forEach(b => b.update(this.scrollTop));
    requestAnimationFrame(() => {
      this.update();
    });
  };
}
