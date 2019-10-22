export default class Shape {
  constructor() {
    this.shape = [];
  }

  clear() {
    this.shape = [];
    this.currentStroke = null;

  }

  startStroke() {
    this.currentStroke = [
      //xpositions
      [],
      //ypositions
      [],
      //time
      []
    ];
    this.startStrokeTime = Date.now();
  }

  updateStroke({
    x,
    y
  }) {
    //add x-coordinate to the stroke
    this.currentStroke[0].push(x);
    //add y-coordinate to the stroke
    this.currentStroke[1].push(y);
    // add timing to the stroke
    this.currentStroke[2].push(Date.now() - this.startStrokeTime);
  }



  endStroke = () => {
    this.shape.push(this.currentStroke);
  }


  getShape() {
    const clone = [...this.shape];
    clone.push(this.currentStroke);

    return clone;
  }


}