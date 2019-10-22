import AutoDrawService from "./AutoDrawService";
import Shape from "./Shape";

export default class DrawArea {
  constructor({ canvas, onSuggestions }) {
    this.canvas = canvas;
    this.onSuggestions = onSuggestions;

    var rect = this.canvas.parentNode.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.context = this.canvas.getContext("2d");
    this.context.strokeStyle = "#555555";

    this.shape = new Shape();
  }

  getSuggestions = () => {
    //TODO: cancel the getSuggestions request when a new one comes in.
    AutoDrawService.getSuggestions(
      this.shape.getShape(),
      this.canvas.width,
      this.canvas.height
    ).then(suggestions => this.onSuggestions(suggestions));
  };

  enable() {
    this.canvas.onmousedown = this.onMouseDown;
    this.canvas.onmouseup = this.onMouseUp;
    this.canvas.onmousemove = this.onMouseMove;

    this.canvas.ontouchstart = this.onMouseDown;
    this.canvas.ontouchend = this.onMouseUp;
    this.canvas.ontouchmove = this.onMouseMove;

    this.canvas.addEventListener("touchstart", e =>
      this.onMouseDown(e.targetTouches[0])
    );
    this.canvas.addEventListener("touchend", e =>
      this.onMouseUp(e.targetTouches[0])
    );
    this.canvas.addEventListener("touchmove", e =>
      this.onMouseMove(e.targetTouches[0])
    );
  }

  disable() {
    this.canvas.onmousedown = null;
    this.canvas.onmouseup = null;
    this.canvas.onmousemove = null;

    this.canvas.ontouchstart = null;
    this.canvas.ontouchend = null;
    this.canvas.ontouchmove = null;
  }

  clear() {
    this.shape = new Shape();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  onMouseDown = e => {
    this.shape.startStroke();

    this.previousSaveTime = Date.now();
    this.context.beginPath();
    this.context / moveTo(e.pageX, e.pageY);

    // console.log(e);

    this.isDown = true;
  };

  onMouseUp = () => {
    this.previousSaveTime = null;
    this.isDown = false;
    this.shape.endStroke();

    this.getSuggestions();
  };

  onMouseMove = e => {
    if (this.isDown) {
      var rect = this.canvas.getBoundingClientRect();

      const coordinate = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this.shape.updateStroke(coordinate);
      this.draw(coordinate);
      //limit the amount of API calls
      const enoughTimeHasPassed =
        Date.now() - this.previousSaveTime > 600 || !this.previousSaveTime;
      if (enoughTimeHasPassed) {
        this.previousSaveTime = Date.now();
        this.getSuggestions();
      }
    }
  };

  draw = ({ x, y }) => {
    this.context.lineTo(x, y);
    this.context.stroke();
  };
}
