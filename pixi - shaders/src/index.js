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

varying vec2 u_uvs;

void main() {

  u_uvs = aUvs;
  vec3 pos =vec3(aVertexPosition, 1.0);
  vec4 totalPos=vec4((projectionMatrix * translationMatrix * pos).xy, 0.0, 1.0);
  gl_Position = totalPos;

}`;

const fragmentSrc = `

precision mediump float;

varying vec2 u_uvs;

uniform sampler2D uSampler2;
uniform float u_time;

float map(float value, float x1, float y1, float x2, float y2) {

 return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}



void main() {
  float max=1.;
  float min=-1.*(max);
  float distortFactor=cos(u_time*.55)*max;
  float normalised= map(distortFactor,min,max,0.,1. );


  float times=5.;//* (normalised);

  
  // gl_FragColor = texture2D(uSampler2,  fract(u_uvs * times)  );
  // gl_FragColor = texture2D(uSampler2, u_uvs - fract(u_uvs * times) * normalised * 0.1 );

  float intensity=1.0;
  float dispFactor=(1.-u_uvs.y);
  float currentDisplacment =dispFactor*intensity;
  float pixelOffset= 0.95*currentDisplacment;//*0.2;

  float radius=0.5;
  float xpos=0.5;//0.5+cos(u_time)*radius;
  float ypos=0.5+sin(u_time)*radius;
  

  float distFromCenter = distance(u_uvs.xy, vec2(xpos,0.5+sin(u_time)*radius));
  pixelOffset=(distFromCenter)*0.8;


  vec4 image=texture2D(uSampler2, vec2(u_uvs.x+pixelOffset, u_uvs.y));
  vec4 debug =vec4(pixelOffset,pixelOffset,pixelOffset,1.0);

  gl_FragColor = mix(image,debug,0.9);
  // gl_FragColor=vec4(pixelOffset,pixelOffset,pixelOffset,1.0);




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
