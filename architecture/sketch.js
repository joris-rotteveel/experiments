// run in console: canvas-sketch sketch.js --open

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const p5 = require("p5");

new p5();

const randomColour = () => {
  const colours = ["#050505", "#fbb230", "#f75275", "#989898"];
  return colours[Math.round(Math.random() * (colours.length - 1))];
};

const getLineWidth = () => 1; //(Math.random() > 0.8 ? 100 : 70);

const settings = {
  dimensions: [2048, 2048],
  p5: true,
  animate: true,
  duration: 4
  // Enable MSAA
  // attributes: {
  //   antialias: true
  // }
};

const w = 240;
const h = 240;
const center = 2048 / 2;

const LT = createVector(center - w / 2, center - w / 2);
const LB = createVector(LT.x, LT.y + h);
const RB = createVector(LT.x + w, LT.y + h);
const RT = createVector(LT.x + w, LT.y);
const style = { lineWidth: getLineWidth(), strokeStyle: randomColour() };
let counter = 0;
const lyrics =
  "my milkshake brings all the boys to the yard, damn right it's better than yours".replace(" ","");
const lines = [
  { from: LT, to: LB, style, letterIndex: 0 },
  { from: LB, to: RB, style, letterIndex: 1 },
  { from: RB, to: RT, style, letterIndex: 2 },
  { from: RT, to: LT, style, letterIndex: 3 }
];

const sqr = x => {
  return x * x;
};

const dist2 = (v, w) => {
  return sqr(v.x - w.x) + sqr(v.y - w.y);
};

const distToSegmentSquared = (p, v, w) => {
  // https://jsfiddle.net/beentaken/9k1sf6p2/
  var l2 = dist2(v, w);

  if (l2 == 0) return dist2(p, v);

  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);

  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
};

const selectLineSegmentIndex = (x, y) => {
  // select line closest to mouse
  let closestDistance = Infinity;
  let closestStartPoint;
  let closestEndPoint;
  let index;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const startPoint = line.from;
    const endPoint = line.to;
    // calculate the distance to the line
    distance = distToSegmentSquared(createVector(x, y), startPoint, endPoint);
    // if the new distance is closer than current closest distance, update.
    if (distance < closestDistance) {
      closestDistance = distance;
      closestStartPoint = startPoint;
      closestEndPoint = endPoint;
      index = i;
    }
  }

  return { start: closestStartPoint, end: closestEndPoint, index };
};

const extrudeSide = (x, y) => {
  const closest = selectLineSegmentIndex(x, y);
  const index = closest.index;
  //move selected segment outwards, find the normal of the line and remove 180 degrees (PI/2);
  const firstPointOnStructure = closest.start;
  const secondPointOnStructure = closest.end;
  const start = p5.Vector.lerp(
    firstPointOnStructure,
    secondPointOnStructure,
    0
  );
  const end = p5.Vector.lerp(start, secondPointOnStructure, 1);

  const maxAngle = (Math.PI / 180) * 45;
  const minAngle = -maxAngle;
  //find the vector that points from end to start
  const directionVector = p5.Vector.sub(start, end).normalize();
  const currentHeading = directionVector.heading();
  //move outwards, substract 180 degrees
  const outsideHeading = currentHeading - Math.PI / 2;
  // give it a random change to go on a slight angle
  const extraSkew = Math.random() > 0.8 ? maxAngle : 0; //random.range(minAngle, maxAngle) : 0;

  const outSideNormalised = p5.Vector.fromAngle(outsideHeading + extraSkew);
  // create the distance between the intial points
  outSideNormalised.mult(random.range(150, 380));

  const startVector = p5.Vector.lerp(
    firstPointOnStructure,
    secondPointOnStructure,
    0
  );
  // pick a point between end and start point
  const endVector = p5.Vector.lerp(startVector, secondPointOnStructure, 1);

  //create the new extruded points
  const newStart = p5.Vector.add(outSideNormalised, startVector);
  const newEnd = p5.Vector.add(outSideNormalised, endVector);

  const width = getLineWidth(); //Math.round(5 + lines.length / 5);

  let currentLength = lines.length - 1;
  if (currentLength > lyrics.length - 4) {
    currentLength = 0;
  }

  lines.splice(
    index,
    //remove the previous connection
    1,
    {
      from: start,
      to: startVector,
      style: {
        lineWidth: width,
        strokeStyle: randomColour()
      }
    },
    {
      from: startVector,
      to: newStart,
      style: {
        lineWidth: width,
        strokeStyle: randomColour()
      }
    },
    {
      from: newStart,
      to: newEnd,
      style: {
        lineWidth: width,
        strokeStyle: randomColour()
      }
    },
    {
      from: newEnd,
      to: endVector,
      style: {
        lineWidth: width,
        strokeStyle: randomColour()
      }
    },
    {
      from: endVector,
      to: secondPointOnStructure,
      style: {
        lineWidth: width,
        strokeStyle: randomColour()
      }
    }
  );

  let letterIndex = 0;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const { to, from } = line;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const amount = dist / 31;
    const end = Math.round(amount);
    const text = "" + lyrics.substring(letterIndex, letterIndex + end);
    line.text = text;
    letterIndex += end;
    if (letterIndex > lyrics.length) letterIndex = 0;
  }
};
window.mouseClicked = () => {
  extrudeSide(mouseX, mouseY);
};

window.mouseMoved = () => {
  if (counter >= 15) {
    counter = 0;
    // extrudeSide(mouseX, mouseY);
  }
};

const defaultStyle = {
  lineWidth: 1,
  lineCap: "square"
};

const sketch = ({ width, height }) => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);

    lines.forEach(({ to, from, style = {}, text }, index) => {
      const { x, y } = to;

      Object.keys(defaultStyle).forEach(key => {
        context[key] = defaultStyle[key];
      });
      //override with special line styles if needed
      Object.keys(style).forEach(key => {
        context[key] = style[key];
      });
      context.fillStyle = "#000000";
      context.textAlign = "left";
      context.font = "48px Verdana";

      const dx = x - from.x;
      const dy = y - from.y;

      const angle = Math.atan2(dy, dx);
      context.save();
      context.translate(from.x, from.y);
      context.rotate(angle);
      context.fillText(text, 0, 0);
      
      context.restore();

      // context.beginPath();
      // context.moveTo(x, y);
      // context.lineTo(from.x, from.y);
      // context.stroke();
      Object.keys(defaultStyle).forEach(key => {
        context[key] = defaultStyle[key];
      });
      //draw a rect on the points
      const w = 10;
      context.strokeRect(x - w / 2, y - w / 2, w, w);
    });
  };
};

canvasSketch(sketch, settings);
