import "./index.css";
import "./App.css";
import {
  Renderer,
  Geometry,
  Program,
  Texture,
  Mesh,
  Vec2,
  Vec4,
  Flowmap
} from "ogl";

import sourceImage from "./assets/water.jpg";

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
uniform sampler2D u_texture;
uniform sampler2D tFlow;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_res;
varying vec2 vUv;
void main() {

  //convert to 0 - 1 
  vec2 st = gl_FragCoord.xy/u_res.xy;

  //center the image and keep aspect ratio
  vec2 rawUV=0.5 * gl_FragCoord.xy / u_res.xy ;
  vec2 uv = (rawUV - vec2(0.5))*u_res.zw + vec2(0.5);
  
  // end centering

  //gradient black to white
  float gradient =smoothstep(0.0,4.0+cos(u_time*1.1)*2.0,st.y);
  uv.y-=gradient*0.2;
  //get pixel value of texture
  vec3 pixelOfTexture = texture2D(u_texture, uv).rgb;

  
	gl_FragColor = vec4(pixelOfTexture.r,pixelOfTexture.g,pixelOfTexture.b,1.0);
  // gl_FragColor = vec4(gradient,gradient,gradient,1.0);
  
}
`;
const imgSize = [512, 512];
const renderer = new Renderer({ dpr: 2 });
const gl = renderer.gl;
document.body.appendChild(gl.canvas);

function resize() {
  let a1, a2;
  var imageAspect = imgSize[1] / imgSize[0];
  if (window.innerHeight / window.innerWidth < imageAspect) {
    a1 = 1;
    a2 = window.innerHeight / window.innerWidth / imageAspect;
  } else {
    a1 = (window.innerWidth / window.innerHeight) * imageAspect;
    a2 = 1;
  }

  mesh.program.uniforms.u_res.value = new Vec4(
    window.innerWidth,
    window.innerHeight,
    a1,
    a2
  );
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize, false);

const flowmap = new Flowmap(gl);
// Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
const geometry = new Geometry(gl, {
  position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
  uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
});
const texture = new Texture(gl, {
  minFilter: gl.LINEAR,
  magFilter: gl.LINEAR
});
const img = new Image();
img.onload = () => (texture.image = img);
img.src = sourceImage;
const res = new Vec2(window.innerWidth, window.innerHeight);

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    u_time: { value: 0 },
    u_texture: { value: texture },
    // Note that the uniform is applied without using an object and value property
    // This is because the class alternates this texture between two render targets
    // and updates the value property after each render.
    tFlow: flowmap.uniform,
    u_resolution: { value: res },
    u_res: {
      value: new Vec4(window.innerWidth, window.innerHeight, 0, 0)
    }
  }
});
const mesh = new Mesh(gl, { geometry, program });
resize();

requestAnimationFrame(update);
function update(t) {
  requestAnimationFrame(update);

  program.uniforms.u_time.value = t * 0.001;
  renderer.render({ scene: mesh });
}
