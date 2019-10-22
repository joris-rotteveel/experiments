const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
// Grab P5.js from npm
const p5 = require("p5");

// Attach p5.js it to global scope
new p5();

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

const adjacencyList = {};
const vertexByID = {};
const verticesIDs = [];
let id = 0;

// https://github.com/inconvergent/inconvergent-sandbox/blob/master/www/js/utils.js

cross = (a, b) => {
  return a.x * b.y - b.x * a.y;
};

intersect = (aa, bb) => {
  // tests whether lines aa and bb intersect.
  // if they intersect, it returns p and q so that
  // p5.Vector.lerp(aa[0], aa[1], p), and
  // p5.Vector.lerp(bb[0], bb[1], q) is the intersection point.
  const a0 = aa[0];
  const a1 = aa[1];
  const b0 = bb[0];
  const b1 = bb[1];

  const sa = a1.copy().sub(a0);
  const sb = b1.copy().sub(b0);
  const u = cross(sa, sb);

  // this is just a safe-guard so we do not divide by zero below.
  // it is not a good way to test for parallel lines
  if (Math.abs(u) <= 0) {
    return { intersect: false, p: null, q: null };
  }

  const ba = a0.copy().sub(b0);
  const q = cross(sa, ba) / u;
  const p = cross(sb, ba) / u;

  return { intersect: p >= 0 && p <= 1 && q >= 0 && q <= 1, p, q };
};

createVertex = (x, y) => {
  const vertex = { id: id, coord: createVector(x, y) };
  id++;
  return vertex;
};

addEdge = (vertexA, vertexB) => {
  if (verticesIDs.indexOf(vertexA.id === -1)) verticesIDs.push(vertexA.id);
  vertexByID[vertexA.id] = vertexA.coord;
  adjacencyList[vertexA.id] = adjacencyList[vertexA.id] || [];

  if (verticesIDs.indexOf(vertexB.id === -1)) verticesIDs.push(vertexB.id);
  vertexByID[vertexB.id] = vertexB.coord;
  adjacencyList[vertexB.id] = adjacencyList[vertexB.id] || [];

  adjacencyList[vertexA.id].push(vertexB.id);
  return [vertexA, vertexB];
};

createIntersectionLine = () => {
  // create a line that will intersect at least 2 exsiting edges
  // don't create vertex just yet
  const startPoint = createVector(Math.random() * 2048, Math.random() * 2048);
  const endPoint = createVector(Math.random() * 2048, Math.random() * 2048);
  const context = window.context;

  context.beginPath();
  context.strokeStyle = "lightgrey";
  context.lineWidth = 1;
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(endPoint.x, endPoint.y);
  context.stroke();

  const intersections = [];

  //loop through all other edges and see if they will intersect
  for (let i = 0; i < verticesIDs.length; i++) {
    const id = verticesIDs[i];
    const startVertex = vertexByID[id];
    const connectedList = adjacencyList[id];

    if (connectedList) {
      for (let j = 0; j < connectedList.length; j++) {
        const vertexID = connectedList[j];
        const connectVertex = vertexByID[vertexID];
        const intersection = intersect(
          [startVertex, connectVertex],
          [startPoint, endPoint]
        );
        if (intersection.intersect) {
          intersections.push({
            intersection,
            startID: id,
            adjecentID: vertexID
          });
        }
      }
    }
  }

  //create intersection point
  for (let index = 0; index < intersections.length; index++) {
    const intersectionData = intersections[index];
    const edge = [
      vertexByID[intersectionData.startID],
      vertexByID[intersectionData.adjecentID]
    ];
    const pointOnEdgeA = p5.Vector.lerp(
      edge[0],
      edge[1],
      intersectionData.intersection.p
    );
    //draw intersection circles
    context.moveTo(pointOnEdgeA.x, pointOnEdgeA.y);
    context.arc(pointOnEdgeA.x, pointOnEdgeA.y, 10, 0, 2 * Math.PI);
    context.stroke();
  }

  if (intersections.length < 2) {
    const newStart = createVertex(startPoint.x, startPoint.y);
    const newEnd = createVertex(endPoint.x, endPoint.y);
    addEdge(newStart, newEnd);
    return [];
  }
  return intersections;
};

splitEdge = intersections => {
  // Find 2 neighboring intersections along the edge.
  const neighbouringIntersections = intersections.splice(0, 2);
  const context = window.context;

  //create intersection point
  for (let index = 0; index < neighbouringIntersections.length; index++) {
    const intersectionData = neighbouringIntersections[index];
    const edge = [
      vertexByID[intersectionData.startID],
      vertexByID[intersectionData.adjecentID]
    ];
    const pointOnEdgeA = p5.Vector.lerp(
      edge[0],
      edge[1],
      intersectionData.intersection.p
    );
    //draw intersection circles
    context.moveTo(pointOnEdgeA.x, pointOnEdgeA.y);
    context.arc(pointOnEdgeA.x, pointOnEdgeA.y, 10, 0, 2 * Math.PI);
    context.stroke();

    //remove original edge
    // from startID key remove the adjectID. adjencyList[startID]
    const nodes = [...adjacencyList[intersectionData.startID]];
    //remove intersectionData.adjecentID from nodesList
    const nodeIndex = nodes.indexOf(intersectionData.adjecentID);
    nodes.splice(nodeIndex, 1);
    adjacencyList[intersectionData.startID] = nodes;

    // split the edge
    //  looked like this
    // []------------[]
    //then got split up and connections removed
    // []------[]-----[]
    //create the 2 new edges

    addEdge(
      {
        id: intersectionData.startID,
        coord: vertexByID[intersectionData.startID]
      },
      {
        id: id,
        coord: pointOnEdgeA
      }
    );

    addEdge(
      {
        id: intersectionData.adjecentID,
        coord: vertexByID[intersectionData.adjecentID]
      },
      {
        id: id,
        coord: pointOnEdgeA
      }
    );
    id++;
  }
};

// ************ SETUP **************

window.mouseClicked = () => {
  console.log("Mouse clicked");
  for (let index = 0; index < 1; index++) {
    const intersections = createIntersectionLine();
    splitEdge(intersections);
  }

  //draw a line
  // wait 10 sec
  //split
};

const pointA = createVertex(400, 100);
const pointB = createVertex(600, 600);

const pointC = createVertex(200, 600);
const pointD = createVertex(400, 175);

const pointE = createVertex(1048, 789);
const pointF = createVertex(1700, 634);

const pointG = createVertex(1248, 1789);
const pointH = createVertex(654, 926);

addEdge(pointA, pointB);
addEdge(pointC, pointD);
addEdge(pointE, pointF);
addEdge(pointG, pointH);

// Based on https://inconvergent.net/2019/a-tangle-of-webs/
const sketch = ({ width, height }) => {
  return ({ context, width, height }) => {
    console.log("hello")
    context.clearRect(0, 0, width, height);
    window.context = context;
    context.lineWidth = 1;
    //loop over all the vertices and draw the edges
    for (let index = 0; index < verticesIDs.length; index++) {
      const id = verticesIDs[index];
      const startVertex = vertexByID[id];
      const connectedList = adjacencyList[id];

      if (connectedList) {
        context.beginPath();
        context.strokeStyle = "black";
        context.fillStyle = "red";
        context.arc(startVertex.x, startVertex.y, 10, 0, 2 * Math.PI);
        context.fill();
        context.moveTo(startVertex.x, startVertex.y);
        for (let j = 0; j < connectedList.length; j++) {
          const vertexID = connectedList[j];
          const connectVertex = vertexByID[vertexID];
          context.lineTo(connectVertex.x, connectVertex.y);
          context.stroke();

          context.beginPath();
          context.moveTo(connectVertex.x, connectVertex.y);
          context.arc(connectVertex.x, connectVertex.y, 3, 0, 2 * Math.PI);
          context.fill();
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
