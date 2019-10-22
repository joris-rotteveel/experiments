import * as PIXI from "pixi.js";

class Letter {
  constructor(letter, stick) {
    this.stick = stick;
    this.letter = letter;

    // this.text = new PIXI.Text(letter, {
  }

  update = () => {
    this.x =
      this.stick.pointB.x +
      (Math.cos(this.stick.angle) * this.stick.length) / 2;
    this.y =
      this.stick.pointB.y +
      (Math.sin(this.stick.angle) * this.stick.length) / 2;
  };

  draw = context => {
    const size = 20;//(1 - this.stick.pointB.oldY / this.stick.pointB.y) * 90;
    context.font = size + "px Arial";
    context.fillText(this.letter, this.x, this.y);
  };
}

export default Letter;
