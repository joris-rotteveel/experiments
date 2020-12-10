import {
  Renderer,
  Vec2,
  Vec4,
  Flowmap,
  Geometry,
  Texture,
  Program,
  Mesh,
} from "ogl";

import logo from "./assets/logo_grafik.svg";

let imgSize = [30, 7];
imgSize = [1600, 1200];
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

export default class OGLRenderer {
  constructor() {
    this.resize = this.resize.bind(this);
    this.update = this.update.bind(this);
    this.updateMouse = this.updateMouse.bind(this);
    this.aspect = 1;
    // Variable inputs to control flowmap
    this.mouse = new Vec2(-1);
    this.velocity = new Vec2();
    this.renderer = new Renderer({
      dpr: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });

    this.lastTime = null;
    this.lastMouse = new Vec2();
    this.gl = this.renderer.gl;
    const parent = document.getElementById("grafik-logo-container");
    parent.appendChild(this.gl.canvas);
    const isTouchCapable = "ontouchstart" in window;

    this.flowmap = new Flowmap(this.gl, { falloff: 0.55, dissipation: 0.9 });
    // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
    const geometry = new Geometry(this.gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });
    const texture = new Texture(this.gl, {
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
      premultiplyAlpha: true,
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
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        tWater: { value: texture },
        res: {
          value: new Vec4(window.innerWidth, window.innerHeight, a1, a2),
        },
        img: { value: new Vec2(imgSize[0], imgSize[1]) },
        // Note that the uniform is applied without using an object and value property
        // This is because the class alternates this texture between two render targets
        // and updates the value property after each render.
        tFlow: this.flowmap.uniform,
      },
    });
    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
    window.addEventListener("resize", this.resize, false);
    this.resize();
    // Create handlers to get mouse position and velocity

    window.addEventListener("mousemove", this.updateMouse, false);

    requestAnimationFrame(this.update);
  }

  updateMouse(e) {
    e.preventDefault();
    if (e.changedTouches && e.changedTouches.length) {
      e.x = e.changedTouches[0].pageX;
      e.y = e.changedTouches[0].pageY;
    }
    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }
    // Get mouse value in 0 to 1 range, with y flipped
    this.mouse.set(
      e.x / this.gl.renderer.width,
      1.0 - e.y / this.gl.renderer.height
    );
    // Calculate velocity
    if (!this.lastTime) {
      // First frame
      this.lastTime = performance.now();
      this.lastMouse.set(e.x, e.y);
    }
    const deltaX = e.x - this.lastMouse.x;
    const deltaY = e.y - this.lastMouse.y;
    this.lastMouse.set(e.x, e.y);
    let time = performance.now();
    // Avoid dividing by 0
    let delta = Math.max(10.4, time - this.lastTime);
    this.lastTime = time;
    this.velocity.x = deltaX / delta;
    this.velocity.y = deltaY / delta;
    // Flag update to prevent hanging velocity values when not moving
    this.velocity.needsUpdate = true;
  }

  update(t) {
    requestAnimationFrame(this.update);
    // Reset velocity when mouse not moving
    if (!this.velocity.needsUpdate) {
      this.mouse.set(-1);
      this.velocity.set(0);
    }
    this.velocity.needsUpdate = false;
    // Update flowmap inputs
    this.flowmap.aspect = this.aspect;
    this.flowmap.mouse.copy(this.mouse);
    // Ease velocity input, slower when fading out
    this.flowmap.velocity.lerp(this.velocity, this.velocity.len ? 0.15 : 0.1);
    this.flowmap.update();
    this.program.uniforms.uTime.value = t * 0.01;
    this.renderer.render({ scene: this.mesh });
  }

  resize() {
    let a1, a2;
    const w = window.innerWidth / 1;
    const h = window.innerHeight / 1;
    var imageAspect = imgSize[1] / imgSize[0];
    if (h / w < imageAspect) {
      a1 = 1;
      a2 = h / w / imageAspect;
    } else {
    }
    a1 = (w / h) * imageAspect;
    a2 = 1;

    a1 = 1;
    a2 = h / w / imageAspect;

    console.log(this.mesh);

    this.mesh.program.uniforms.res.value = new Vec4(w, h, a1, a2);
    this.renderer.setSize(w, h);
    this.aspect = w / h;
  }
}
