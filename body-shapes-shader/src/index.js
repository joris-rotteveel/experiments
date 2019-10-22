import { Renderer, Camera, Orbit, Transform, Vec3, Color, Polyline } from "ogl";

import "./index.css";
import { createVector } from "./p5/p5";

let currentPoses = null;
let posenet = null;
const video = document.getElementById("video");

// https://github.com/tensorflow/tfjs-models/tree/master/posenet

const vertex = `
attribute vec3 position;
attribute vec3 next;
attribute vec3 prev;
attribute vec2 uv;
attribute float side;

uniform vec2 uResolution;
uniform float uDPR;
uniform float uThickness;


vec4 getPosition() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
  vec2 nextScreen = next.xy * aspect;
  vec2 prevScreen = prev.xy * aspect;

  vec2 tangent = normalize(nextScreen - prevScreen);
  vec2 normal = vec2(-tangent.y, tangent.x);
  normal /= aspect;
  normal *= 1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0);

  float pixelWidth = 1.0 / (uResolution.y / uDPR);
  normal *= pixelWidth * uThickness;

  // When the points are on top of each other, shrink the line to avoid artifacts.
  float dist = length(nextScreen - prevScreen);
  normal *= smoothstep(0.0, 0.02, dist);

  vec4 current = vec4(position, 1);
  current.xy -= normal * side;
    return current;
}

void main() {
    gl_Position = getPosition();
}
`;

const renderer = new Renderer({ dpr: 2, alpha: true, autoClear: false });
const gl = renderer.gl;
document.body.appendChild(gl.canvas);
gl.clearColor(0.9, 0.9, 0.9, 1);

const camera = new Camera(gl);
camera.position.z = 20;

const controls = new Orbit(camera);

const scene = new Transform();

const lines = [];

const poseParts = {
  // leftHip: { position: new Vec3(), color: "#ff0000" },
  // leftKnee: { position: new Vec3(), color: "#ff00ff" },
  leftWrist: { position: new Vec3(), color: "#f0f0ff" },

  // rightHip: { position: new Vec3(), color: "#ff0000" },
  // rightKnee: { position: new Vec3(), color: "#ff00ff" },
  rightWrist: { position: new Vec3(), color: "#f0f0ff" }
};

const bodyPoints = Object.values(poseParts);

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.perspective({
    aspect: gl.canvas.width / gl.canvas.height0
  });

  lines.forEach(line => {
    line.resize();
  });
};

const createLines = () => {
  for (let index = 0; index < bodyPoints.length; index++) {
    const { color } = bodyPoints[index];
    const count = 10;
    const points = [];
    for (let i = 0; i < count; i++) {
      const x = i / (count - 1) - 0.5;
      const y = 0;
      const z = 0;

      points.push(new Vec3(x, y, z));
    }

    const polyline = new Polyline(gl, {
      points,
      vertex,
      uniforms: {
        uColor: { value: new Color(color) },
        uThickness: { value: 10 }
      }
    });

    polyline.mesh.setParent(scene);

    lines.push(polyline);
  }
};

const updatePoses = () => {
  if (!currentPoses) return;

  const threshold = 0.12;

  for (let index = 0; index < currentPoses.length; index++) {
    const { keypoints, score } = currentPoses[index];
    if (score > threshold) {
      for (let i = 0; i < keypoints.length; i++) {
        const { position, part } = keypoints[i];
        if (poseParts[part]) {
          poseParts[part].position.set(
            (position.x / gl.renderer.width) * 2 - 1,
            (position.y / gl.renderer.height) * -2 + 1,
            0
          );
        }
      }
    }
  }
};

const update = delta => {
  requestAnimationFrame(update);
  const tmp = new Vec3();
  const spring = 1; // 0.06;
  const friction = 1; //0.85;
  const mouseVelocity = new Vec3();

  lines.forEach((polyline, index) => {
    const { points } = polyline;
    const { position } = bodyPoints[index];

    for (let i = points.length - 1; i >= 0; i--) {
      if (!i) {
        tmp
          .copy(position)
          .sub(points[i])
          .multiply(spring);
        mouseVelocity.add(tmp).multiply(friction);
        points[i].add(mouseVelocity);

        // points[i].lerp(position, 1);
      } else {
        points[i].lerp(points[i - 1], 0.78);
      }
    }
    polyline.updateGeometry();
  });

  controls.update();
  renderer.render({ scene, camera });
};

const estimatePoses = () => {
  if (posenet && video.readyState === 4) {
    posenet
      .estimateMultiplePoses(video, {
        flipHorizontal: false,
        maxDetections: 12,
        scoreThreshold: 0.15,
        nmsRadius: 20
      })
      .then(p => {
        currentPoses = [...p];
        updatePoses();

        estimatePoses();
      });
  }
};

const setup = () => {
  const video = document.getElementById("video");
  video.oncanplaythrough = () => {
    window.posenet.load().then(net => {
      posenet = net;
      estimatePoses();
    });
  };

  createLines();
  requestAnimationFrame(update);
};

window.addEventListener("resize", onResize);

setup();
onResize();
