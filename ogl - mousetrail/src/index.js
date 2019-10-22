import "./index.css";
import "./App.css";
import { Renderer, Camera, Orbit, Transform, Vec3, Color, Polyline } from "ogl";

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

const renderer = new Renderer({ dpr: 2 });
const gl = renderer.gl;
document.body.appendChild(gl.canvas);
gl.clearColor(0.9, 0.9, 0.9, 1);

const camera = new Camera(gl);
camera.position.z = 20;

const controls = new Orbit(camera);

const scene = new Transform();

let polyline;

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.perspective({
    aspect: gl.canvas.width / gl.canvas.height0
  });
  if (polyline) polyline.resize();
};

window.addEventListener("resize", resize, false);

const mouse = new Vec3();
const spring = 0.06;
const friction = 0.85;
const mouseVelocity = new Vec3();
const tmp = new Vec3();

const updateMouse = e => {
  mouse.set(
    (e.x / gl.renderer.width) * 2 - 1,
    (e.y / gl.renderer.height) * -2 + 1,
    0
  );
};

const count = 20;
const points = [];
for (let i = 0; i < count; i++) {
  const x = i / (count - 1) - 0.5;
  const y = 0;
  const z = 0;

  points.push(new Vec3(x, y, z));
}

polyline = new Polyline(gl, {
  points,
  vertex,
  uniforms: {
    uColor: { value: new Color("#ff0000") },
    uThickness: {value: 40},
  }
});

polyline.mesh.setParent(scene);

const update = t => {
  requestAnimationFrame(update);

  for (let i = points.length - 1; i >= 0; i--) {
    if (!i) {
      tmp
        .copy(mouse)
        .sub(points[i])
        .multiply(spring);
      mouseVelocity.add(tmp).multiply(friction);
      points[i].add(mouseVelocity);
    } else {
      points[i].lerp(points[i - 1], 0.9);
    }
  }
  polyline.updateGeometry();

  controls.update();
  renderer.render({ scene, camera });
};

resize();
window.addEventListener("mousemove", updateMouse, false);
requestAnimationFrame(update);
