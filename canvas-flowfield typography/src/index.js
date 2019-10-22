import * as p5 from 'p5';

import Particle from './Particle';
import './index.css';

let s = sketch => {
  var inc = 0.03;
  var scl = 3.0;
  var cols, rows;

  var zoff = 0;

  const movingPoint = sketch.createVector(0, 0);
  let angleX = 0;
  let angleY = 0;
  let angleSpeedX = 0.02;
  let angleSpeedY = 0.02;
  const radiusX = 100;
  const radiusY = 80;
  const pallete = ['#b4b9cc', '#ffca62', '#ee5f82'];
  const backgroundColour="#000000";
  const centerColour="#a0ea1f";

  let baseColour;
  var flowfield;
  var particles = [];

  const createFlowField = () => {
      for (var i = 0; i < particles.length; i++) {
          particles[i].reset();
        }
        baseColour = pallete[Math.round(Math.random() * (pallete.length - 1))];
        var yoff = 0;
        zoff = Math.random() * 100;
        for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (var x = 0; x < cols; x++) {
                var index = x + y * cols;
                var angle = sketch.noise(xoff, yoff, zoff) * Math.PI * 2 * 10;
                var v = p5.Vector.fromAngle(angle);
                v.setMag(1);
                flowfield[index] = v;
                xoff += inc;
                
                // sketch.stroke(0, 50);
                // sketch.push();
                // sketch.translate(x * scl, y * scl);
                // sketch.rotate(v.heading());
                // sketch.strokeWeight(1);
                // sketch.line(0, 0, scl, 0);
                // sketch.pop();
            }
            yoff += inc;
            
            //   zoff += 0.00033;
        }
    };
    
    document.addEventListener('mousedown', createFlowField);
    
    sketch.setup = () => {

      const w=window.innerWidth;
      const h=window.innerHeight;
        sketch.createCanvas(w, h);
        sketch.colorMode(p5.HSB, 255);
        cols = Math.floor(sketch.width / scl);
        rows = Math.floor(sketch.height / scl);
        
        flowfield = new Array(cols * rows);
        
        for (var i = 0; i < 400; i++) {
            particles[i] = new Particle(sketch, scl, cols);
        }
        
        
        
        createFlowField();
        sketch.background(backgroundColour);
  };

  sketch.draw = () => {
    // sketch.clear();
    // sketch.background(51);

    angleX += angleSpeedX;
    angleY += angleSpeedY;

    const movingRadiusX=radiusX;//Math.cos(angleY)*radiusX+Math.random()*100;
    const movingRadiusY=radiusY;//Math.sin(angleX)*radiusY+Math.random()*100;

    const middle = sketch.createVector(sketch.width / 2, sketch.height / 2);

    movingPoint.x = middle.x + Math.cos(angleX) * movingRadiusX;
    movingPoint.y = middle.y + Math.sin(angleY) * movingRadiusY;

    // sketch.ellipse(movingPoint.x, movingPoint.y, 1, 1);

    const radius = 220;

    for (var i = 0; i < particles.length; i++) {
      const particle = particles[i];
      particle.follow(flowfield);
      particle.update();
      particle.edges();

      particle.setColor(baseColour);

      const distanceToMovingPoint = movingPoint.dist(particle.pos);
      const alpha = 1 - Math.min(radius, distanceToMovingPoint) / radius;

      const distanceToCirclee = middle.dist(particle.pos);

        particle.setAlpha(0);
      if (distanceToCirclee < 100) {
        particle.setColor(centerColour);
      }
        particle.setAlpha(alpha * 0.1);
      //   particle.setAlpha(0.5);

      particle.show();
    }
  };
};

const P5 = new p5(s);
