import * as PIXI from "pixi.js";
import { getPointOnCurve } from "./app";

export default class Line {
  constructor({
    startPoint,
    endPoint,
    controlPoint,
    debug = false,
    highlight = false,
  }) {
    this.debug = debug;
    this.highlight = highlight;
    // this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.alpha = 1;
    this.startPoint = { ...startPoint, original: { ...startPoint } };
    this.endPoint = { ...endPoint, original: { ...endPoint } };
    this.controlPoint = { ...controlPoint, original: { ...controlPoint } };
    this.connections = [];
    this.debugContainer = new PIXI.Container();

    this.debugStart = new PIXI.Graphics();
    this.debugStart.interactive = true;
    this.debugStart.beginFill(0x00ff00);
    this.debugStart.drawCircle(0, 0, 10);
    this.debugStart
      .on("pointerdown", this.onDragStart)
      .on("pointerup", this.onDragEnd)
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);

    this.debugControl = new PIXI.Graphics();
    this.debugControl.interactive = true;
    this.debugControl.beginFill(0x0000ff);
    this.debugControl.drawCircle(0, 0, 10);
    this.debugControl
      .on("pointerdown", this.onDragStart)
      .on("pointerup", this.onDragEnd)
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);

    this.debugEnd = new PIXI.Graphics();
    this.debugEnd.interactive = true;
    this.debugEnd.beginFill(0xff0000);
    this.debugEnd.drawCircle(0, 0, 10);
    this.debugEnd
      .on("pointerdown", this.onDragStart)
      .on("pointerup", this.onDragEnd)
      .on("pointerupoutside", this.onDragEnd)
      .on("pointermove", this.onDragMove);

    if (debug) {
      this.debugContainer.addChild(this.debugStart);
      this.debugContainer.addChild(this.debugControl);
      this.debugContainer.addChild(this.debugEnd);
    }

    this.debugStart.x = this.startPoint.x;
    this.debugStart.y = this.startPoint.y;
    this.debugEnd.y = this.endPoint.y;
    this.debugEnd.x = this.endPoint.x;
    this.debugControl.y = this.controlPoint.y;
    this.debugControl.x = this.controlPoint.x;
  }
  connect = (line, pct) => {
    this.connections.push({ line, pct });
  };

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.active = event.target;

    this.dragging = true;
  }
  setAlpha = (alpha) => {
    this.alpha = alpha;
  };
  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.active = null;
    // set the interaction data to null
    this.data = null;
  }

  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.debugContainer);
      this.active.x = newPosition.x;
      this.active.y = newPosition.y;
    }
  }

  draw = (grfx) => {
    if (this.debug) {
      this.startPoint.x = this.debugStart.x;
      this.startPoint.y = this.debugStart.y;
      this.endPoint.y = this.debugEnd.y;
      this.endPoint.x = this.debugEnd.x;
      this.controlPoint.y = this.debugControl.y;
      this.controlPoint.x = this.debugControl.x;
    } else {
      this.connections.forEach(({ line, pct }) => {
        const intersection = getPointOnCurve(this, pct);

        line.startPoint.x = intersection.x;
        line.startPoint.y = intersection.y;
      });

      this.debugStart.x = this.startPoint.x;
      this.debugStart.y = this.startPoint.y;
      this.debugEnd.y = this.endPoint.y;
      this.debugEnd.x = this.endPoint.x;
      this.debugControl.y = this.controlPoint.y;
      this.debugControl.x = this.controlPoint.x;
    }

    const color = this.highlight ? 0xff00ff : 0xffffff;
    grfx.lineStyle(20, color, 1);

    grfx.moveTo(this.startPoint.x, this.startPoint.y);
    grfx.quadraticCurveTo(
      this.controlPoint.x,
      this.controlPoint.y,
      this.endPoint.x,
      this.endPoint.y
    );
  };

  toString() {
    return `{
        startPoint: { x: ${Math.round(this.startPoint.x)}, y: ${Math.round(
      this.startPoint.y
    )} },
        controlPoint: { x: ${Math.round(this.controlPoint.x)}, y: ${Math.round(
      this.controlPoint.y
    )} },
        endPoint: { x: ${Math.round(this.endPoint.x)}, y: ${Math.round(
      this.endPoint.y
    )} },
   
      },`;
  }
}
