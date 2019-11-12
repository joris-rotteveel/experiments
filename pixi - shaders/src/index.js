import "./index.css";
import * as PIXI from "pixi.js";
import Image from "./assets/hello.jpg";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true
  // backgroundColor: 0xffffff
});
const geometry = new PIXI.Geometry()
  .addAttribute(
    "aVertexPosition", // the attribute name
    [
      -100,
      -100, // x, y
      100,
      -100, // x, y
      100,
      100,
      -100,
      100
    ], // x, y
    2
  ) // the size of the attribute
  .addAttribute(
    "aUvs", // the attribute name
    [
      0,
      0, // u, v
      1,
      0, // u, v
      1,
      1,
      0,
      1
    ], // u, v
    2
  ) // the size of the attribute
  .addIndex([0, 1, 2, 0, 2, 3]);

const checkThis = `#define PI 3.14159265359

  void mainUv(inout vec2 uv) {
          vec4 tex = texture2D(uTexture, uv);
      // Convert normalized values into regular unit vector
          float vx = -(tex.r *2. - 1.);
          float vy = -(tex.g *2. - 1.);
      // Normalized intensity works just fine for intensity
          float intensity = tex.b;
          float maxAmplitude = 0.2;
          uv.x += vx * intensity * maxAmplitude;
          uv.y += vy * intensity * maxAmplitude;
      }`;

const vertexSrc = `

precision mediump float;

attribute vec2 aVertexPosition;
attribute vec2 aUvs;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

varying vec2 vUvs;

void main() {

  vUvs = aUvs;
  vec3 pos =vec3(aVertexPosition, 1.0);
  vec4 totalPos=vec4((projectionMatrix * translationMatrix * pos).xy, 0.0, 1.0);
  gl_Position = totalPos;

}`;

const fragmentSrc = `

precision mediump float;

varying vec2 vUvs;

uniform sampler2D uSampler2;
uniform float u_time;

float map(float value, float x1, float y1, float x2, float y2) {

 return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}



void main() {
  //convert to 0 - 1 
  //gradient black to white
  float max=1.;
  float min=-1.*(max);
  float distortFactor=cos(u_time*5.)*max;


  
  float normalised= map(distortFactor,min,max,0.,1. );


  float times=5.;// * (normalised);
  vec2 direction=vec2(0.,fract(vUvs.y*vUvs.y));

  //distort the uv
  // gl_FragColor = texture2D(uSampler2, vUvs - vUvs * direction * normalised * 2.95);

  
  gl_FragColor = texture2D(uSampler2,  fract(vUvs * times)  );
  gl_FragColor = texture2D(uSampler2, vUvs - fract(vUvs * times) * normalised * 0.1 );



  //strecth and multiply
  vec2 multiply= vec2(11.,0.);
  
  // gl_FragColor = texture2D(uSampler2, vUvs - multiply * normalised * .1 );

  vec2 repeat=fract(times*vUvs);
  repeat.x+=vUvs.x*vUvs.y;
  repeat.y+=vUvs.x*vUvs.y;
  vec4 color=texture2D(uSampler2,repeat);
  // gl_FragColor = color;
  // gl_FragColor = vec4(color.x,color.y,1.0,1.0);

  // vec2 uv=vUvs - vUvs * vec2(1.,0.0) * normalised * 0.5;
  // uv.x=vUvs.x;
  // gl_FragColor = texture2D(uSampler2, uv);

}`;

const uniforms = {
  uSampler2: PIXI.Texture.from(Image),
  u_time: 0
};

const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

const quad = new PIXI.Mesh(geometry, shader);
quad.scale.set(2);
quad.position.set(window.innerWidth / 2, window.innerHeight / 2);

app.stage.addChild(quad);
document.body.appendChild(app.view);

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const update = delta => {
  // quad.rotation += 0.01;
  quad.shader.uniforms.u_time += 0.01; //(quad.rotation % 360) / 360;
};

const setup = () => {
  app.ticker.add(update);
};

setup();
