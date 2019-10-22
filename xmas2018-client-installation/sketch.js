//use the p5js setup hook, this enables us to use p5js for Math functions

var socket = io.connect("http://127.0.0.1:8125/");
let bodyInputs = [];
const USE_MOUSE = true;

function setup() {
  this.onWordDone = this.onWordDone.bind(this);
  this.onBodyFrame = this.onBodyFrame.bind(this);
  this.showNextWord = this.showNextWord.bind(this);
  this.setInputs = this.setInputs.bind(this);
  this.renderLoop = this.renderLoop.bind(this);
  this.allQuotes = window.quotes;

  this.globalMouse = createVector(0, 0);

  document.addEventListener(
    "mousemove",
    e => {
      this.globalMouse.x = e.pageX;
      this.globalMouse.y = e.pageY;
      this.setInputs();
    },
    false
  );

  document.addEventListener("keyup", () => {
    this.forceClose = !this.forceClose;
  });

  this.quoteIndex = 0;
  //Create a Pixi Application
  this.app = new WordPlay();
  this.app.canvas.addEventListener("wordDone", this.showNextWord);
  noCanvas();
  start();
}

function start() {
  if (!USE_MOUSE) {
    socket.on("bodyFrame", this.onBodyFrame);
  }
  this.showNextWord();

  this.renderLoop();
}

function renderLoop() {
  this.updateBodyParts();
  window.requestAnimationFrame(this.renderLoop);
}
function updateBodyParts() {
  for (let index = 0; index < bodyInputs.length; index++) {
    const body = bodyInputs[index];
    body.update();
  }
}
function showNextWord() {
  if (this.quoteIndex > this.allQuotes.length - 1) {
    this.quoteIndex = 0;
  }
  this.app.showWord({
    word: this.allQuotes[this.quoteIndex],
    time: 30
  });
  this.quoteIndex++;
}

function onWordDone() {
  this.showNextWord();
}
function getBodyById(id) {
  let foundIndex = -1;
  for (let index = 0; index < bodyInputs.length; index++) {
    const element = bodyInputs[index];
    if (element.id === id) {
      foundIndex = index;
    }
  }

  if (foundIndex === -1) {
    const input = new BodyInput(id);
    bodyInputs.push(input);
    return input;
  } else {
    return bodyInputs[foundIndex];
  }
}

function setInputs() {
  if (USE_MOUSE) {
    const bodyFrame = {
      bodies: [
        {
          trackingId: 0,
          tracked: true,

          joints: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            {
              depthX: this.globalMouse.x / window.innerWidth,
              depthY: this.globalMouse.y / window.innerHeight
            },
            null,
            null,
            null,
            {
              depthX:
                (window.innerWidth - this.globalMouse.x) / window.innerWidth,
              depthY:
                (window.innerHeight - this.globalMouse.y) / window.innerHeight
            }
          ],

          leftHandState: this.forceClose ? 3 : 2,
          rightHandState: this.forceClose ? 3 : 2
        }
      ]
    };
    onBodyFrame(bodyFrame);
  } else {
  }
}

function onBodyFrame(bodyFrame) {
  inputs = [];

  const currentBodieIDs = [];
  bodyFrame.bodies.forEach(function(body) {
    if (body.tracked) {
      const input = getBodyById(body.trackingId);

      currentBodieIDs.push(body.trackingId);

      const positionLeft = createVector(
        body.joints[7].depthX * window.innerWidth,
        body.joints[7].depthY * window.innerHeight
      );
      const positionRight = createVector(
        body.joints[11].depthX * window.innerWidth,
        body.joints[11].depthY * window.innerHeight
      );

      input.setHands(
        { state: body.leftHandState, position: positionLeft },
        { state: body.rightHandState, position: positionRight }
      );
      inputs.push(input.left);
      inputs.push(input.right);
    }
  });

  this.app.updateInput(inputs);
}
