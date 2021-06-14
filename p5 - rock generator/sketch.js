const escapeHatch = 10000;
let currentTries = 0;
const rocks = [];
const amount = 5;
const w = window.innerWidth;
const h = window.innerHeight;
const center = { x: w / 2, y: h / 2 };
const pondDiameter = 500;
const pondRadius = pondDiameter / 2;
// const minRockRadius = pondRadius * 0.05;
// const maxRockRadius = pondRadius * 0.08;
const meanRockRadius = 20;
const deviationRockRadius = meanRockRadius * 1.5; //pondRadius * 0.15;
const rockPadding = 2;

// 1)Can we have some sort of Bell-curve distribution of size?
// so one or two extra big, one or two smalls, but most of them are somewhere in the middle?
// 2) none of them touch.
// 3) they pack a bit tighter, so there's not big gaps

function setup() {
  // put setup code here
  createCanvas(w, h);
  // randomSeed(2);
  while (rocks.length < amount) {
    const radius = abs(randomGaussian() * deviationRockRadius) + meanRockRadius;
    //random(minRockRadius, maxRockRadius);
    const offset = random(pondRadius - radius);
    const randomAngle = random(2 * Math.PI);

    const rock = new Rock({
      x: center.x + Math.cos(randomAngle) * offset,
      y: center.y + Math.sin(randomAngle) * offset,
      radius: radius,
    });
    let isTooClose = false;
    for (let nextIndex = 0; nextIndex < rocks.length; nextIndex++) {
      const other = rocks[nextIndex];
      const distance = dist(rock.x, rock.y, other.x, other.y);
      const minDist = rock.radius + rockPadding + other.radius + rockPadding;
      if (distance < minDist) {
        isTooClose = true;
        break;
      }
    }
    if (!isTooClose) {
      rocks.push(rock);
    } else {
      currentTries++;
      if (currentTries > escapeHatch) {
        break;
      }
    }
  }
}

function draw() {
  clear();
  // draw pond
  fill(255, 100, 100);
  noStroke();
  ellipse(center.x, center.y, pondDiameter, pondDiameter);
  // draw rocks
  for (let index = 0; index < rocks.length; index++) {
    const rock = rocks[index];
    const dx = mouseX - rock.x;
    const dy = mouseY - rock.y;
    const angleOfLightSource = Math.atan2(dy, dx);
    rock.drawShadow(angleOfLightSource);
  }
  for (let index = 0; index < rocks.length; index++) {
    const rock = rocks[index];
    rock.draw();
  }
}

// let distribution = new Array(Math.ceil(w / (10 + 1)));
// function setup() {
//   // randomSeed(19);
//   createCanvas(w, h);
//   for (let i = 0; i < distribution.length; i++) {
//     distribution[i] = randomGaussian(100, 100);
//   }
//   distribution.sort(function (a, b) {
//     return a - b;
//   });
// }
// function draw() {
//   const last = distribution[distribution.length - 1];
//   stroke(0);
//   line(0, 300, w, 300);
//   for (let i = 0; i < distribution.length; i++) {
//     // rotate(TWO_PI / distribution.length);
//     let dist = distribution[i];
//     line(i * 10, 300, i * 10, 300 + dist);
//   }
//   stroke(0);
//   line(0, 300 + 100, w, 300 + 100);
// }
