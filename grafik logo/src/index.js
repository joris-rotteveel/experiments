import "./index.css";
//71kb
// import { Renderer } from "../node_modules/ogl/src/core/Renderer";
// import { Vec2 } from "../node_modules/ogl/src/math/Vec2";
// import { Vec4 } from "../node_modules/ogl/src/math/Vec4";
// import { Geometry } from "../node_modules/ogl/src/core/Geometry";
// import { Texture } from "../node_modules/ogl/src/core/Texture";
// import { Program } from "../node_modules/ogl/src/core/Program";
// import { Mesh } from "../node_modules/ogl/src/core/Mesh";
// import { Flowmap } from "../node_modules/ogl/src/extras/Flowmap";

//67kb
// import { Renderer } from "./ogl/src/core/Renderer";
// import { Vec2 } from "./ogl/src/math/Vec2";
// import { Vec4 } from "./ogl/src/math/Vec4";
// import { Geometry } from "./ogl/src/core/Geometry";
// import { Texture } from "./ogl/src/core/Texture";
// import { Program } from "./ogl/src/core/Program";
// import { Mesh } from "./ogl/src/core/Mesh";
// import { Flowmap } from "./ogl/src/extras/Flowmap";

// 71kb
// import {
//    Renderer,
//   Vec2,
//   Vec4,
//   Geometry,
//   Texture,
//   Program,
//   Mesh
// } from "../node_modules/ogl/src/Core";
// import { Flowmap } from "../node_modules/ogl/src/extras/Flowmap";

// 100kb
// import {
//    Renderer,
//   Vec2,
//   Vec4,
//   Geometry,
//   Texture,
//   Program,
//   Mesh
// } from "ogl";
// import { Flowmap } from "ogl";

 import logo from "./assets/logo_grafik.svg";


const Renderer = window.ogl.Renderer;
const Vec2 = window.ogl.Vec2;
const Vec4 = window.ogl.Vec4;
const Geometry = window.ogl.Geometry;
const Texture = window.ogl.Texture;
const Program = window.ogl.Program;
const Mesh = window.ogl.Mesh;
const Flowmap = window.ogl.Flowmap;

let elementOffset = 0;
let imgSize = [1600, 1200];
const SVG_HEIGHT_AT_100 = 325;
const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
          vUv = uv;        
          gl_Position = vec4(position, 0, 1);
      }
  `;
const fragment = `
      precision highp float;
      precision highp int;
      uniform sampler2D tWater;
      uniform sampler2D tFlow;
      uniform float uTime;
      varying vec2 vUv;
      uniform vec4 res;
      void main() {
          // R and G values are velocity in the x and y direction
          // B value is the velocity length
          vec3 flow = texture2D(tFlow, vUv).rgb;
          vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
          vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
          myUV -= flow.xy * (0.15 * 0.5);
          vec3 tex = texture2D(tWater, myUV).rgb;
          gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
          gl_FragColor.a = tex.r;
      }
  `;
{
  const renderer = new Renderer({
    dpr: 2,
    alpha: true,
    premultipliedAlpha: true,
    antialias: true
  });
  const gl = renderer.gl;
  const effectHolder = document.getElementById("grafik-logo-container");
  effectHolder.appendChild(gl.canvas);
  const isTouchCapable = "ontouchstart" in window;
  // Variable inputs to control flowmap
  let aspect = 1;
  const mouse = new Vec2(-1);
  const velocity = new Vec2();

  function resize() {
    const w = effectHolder.getBoundingClientRect().width; // window.innerWidth / 1;
    // change this to the height you'd like your canvas to be
    const h = effectHolder.getBoundingClientRect().height;

    var imageAspect = imgSize[1] / imgSize[0];

    const newWidth = 1;
    const newHeight = h / w / imageAspect;

    const paddingFromBottom = 20;
    const svgHeight = SVG_HEIGHT_AT_100 * (w / 1600);
    const halfHeight = svgHeight / 2;

    effectHolder.style.transform = `translateY(${-halfHeight -
      paddingFromBottom}px)`;

    mesh.program.uniforms.res.value = new Vec4(w, h, newWidth, newHeight);
    renderer.setSize(w * 1.25, h * 1);
    aspect = w / (2 * h);

    var bodyRect = document.body.getBoundingClientRect(),
      elemRect = effectHolder.getBoundingClientRect();
    elementOffset = { x: elemRect.left, y: elemRect.top - bodyRect.top };
  }

  // tweak these values for different distortion properties
  const flowmap = new Flowmap(gl, { falloff: 0.55, dissipation: 0.9 });
  // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
  const geometry = new Geometry(gl, {
    position: {
      size: 2,
      data: new Float32Array([-1, -1, 3, -1, -1, 3])
    },
    uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
  });
  const texture = new Texture(gl, {
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    premultiplyAlpha: true
  });
  const img = new Image();
  img.onload = () => (texture.image = img);
  img.crossOrigin = "Anonymous";

  img.src = logo;

  let a1, a2;
  var imageAspect = imgSize[1] / imgSize[0];
  if (window.innerHeight / window.innerWidth < imageAspect) {
    a1 = 1;
    a2 = window.innerHeight / window.innerWidth / imageAspect;
  } else {
    a1 = (window.innerWidth / window.innerHeight) * imageAspect;
    a2 = 1;
  }
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      tWater: { value: texture },
      res: {
        value: new Vec4(window.innerWidth, window.innerHeight, a1, a2)
      },
      img: { value: new Vec2(imgSize[0], imgSize[1]) },
      // Note that the uniform is applied without using an object and value property
      // This is because the class alternates this texture between two render targets
      // and updates the value property after each render.
      tFlow: flowmap.uniform
    }
  });
  const mesh = new Mesh(gl, { geometry, program });
  window.addEventListener("resize", resize, false);
  resize();
  // Create handlers to get mouse position and velocity

  window.addEventListener("mousemove", updateMouse, false);

  let lastTime;
  const lastMouse = new Vec2();
  function updateMouse(e) {
    e.preventDefault();

    // if (e.changedTouches && e.changedTouches.length) {
    //   e.x = e.changedTouches[0].pageX;
    //   e.y = e.changedTouches[0].pageY;
    // }
    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }
    // Get mouse value in 0 to 1 range, with y flipped
    mouse.set(
      (e.x - elementOffset.x) / gl.renderer.width,
      1.0 - (e.y - (elementOffset.y - window.scrollY)) / gl.renderer.height
    );
    // Calculate velocity
    if (!lastTime) {
      // First frame
      lastTime = performance.now();
      lastMouse.set(e.x, e.y);
    }
    const deltaX = e.x - lastMouse.x;
    const deltaY = e.y - lastMouse.y;
    lastMouse.set(e.x, e.y);
    let time = performance.now();
    // Avoid dividing by 0
    let delta = Math.max(10.4, time - lastTime);
    lastTime = time;
    velocity.x = deltaX / delta;
    velocity.y = deltaY / delta;
    // Flag update to prevent hanging velocity values when not moving
    velocity.needsUpdate = true;
  }

  requestAnimationFrame(update);

  function update(t) {
    requestAnimationFrame(update);
    // Reset velocity when mouse not moving
    if (!velocity.needsUpdate) {
      mouse.set(-1);
      velocity.set(0);
    }
    velocity.needsUpdate = false;
    // Update flowmap inputs
    flowmap.aspect = aspect;
    flowmap.mouse.copy(mouse);
    // Ease velocity input, slower when fading out
    flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
    flowmap.update();
    program.uniforms.uTime.value = t * 0.01;
    renderer.render({ scene: mesh });
  }
}
