import * as PIXI from "pixi.js";
import tikiTexture from "./assets/tiki.png";

export default class Tiki {
  constructor({ startPoint }) {
    // this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.startPoint = startPoint;

    this.sprite = PIXI.Sprite.from(tikiTexture);
    this.sprite.anchor.set(0.5);
    this.sprite.rotation =0;
    this.sprite.scale.set(0.5);
    this.sprite.interactive = true;

    this.sprite
      .on("pointerdown", this.onDragStart)
      .on("pointerup", this.onDragEnd)
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;

    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;

    // set the interaction data to null
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.sprite.parent);
      this.startPoint.x = newPosition.x;
      this.startPoint.y = newPosition.y;
    }
  }

  update() {
    this.sprite.x = this.startPoint.x;
    this.sprite.y = this.startPoint.y;
  }

  toString() {
    return `{
        startPoint: { x: ${Math.round(this.startPoint.x)}, y: ${Math.round(
      this.startPoint.y
    )} },
       
      },`;
  }
}
