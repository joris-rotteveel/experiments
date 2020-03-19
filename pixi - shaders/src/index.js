import "./index.css";
import * as PIXI from "pixi.js";
import Image from "./assets/hello.jpg";
import Image2 from "./assets/alt.png";
import { mapRange } from "./math";

let mouse = { x: 0, y: 0 };

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,

  backgroundColor: 0xffffff
});

document.addEventListener("mousemove", e => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
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
#define TWO_PI 6.28318530718
#define PI 3.141592653589793
precision mediump float;

varying vec2 u_uvs;

uniform sampler2D u_image;
uniform sampler2D u_image_alt;
uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_vp_width;
uniform float u_vp_height;

float map(float value, float x1, float y1, float x2, float y2) {

 return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}



void main() {

   
  vec2 center=vec2(0.5);
  
  // float distFromCenter = distance(u_uvs.xy,center);
  // vec3 circleShape = vec3(step(0.15,distFromCenter));
  
  // vec2 toCenter = vec2(0.5)-u_uvs;
  // float raw_direction=atan(toCenter.y,toCenter.x)/(PI);
  // float direction=map(raw_direction,-1.,1.,0.,1.);

  
  // vec2 pixelOffset=vec2(u_uvs.x+direction,u_uvs.y);
  // vec4 image=texture2D(u_image, pixelOffset);
  
  
  // vec4 debug =vec4(vec3(direction),1.);

  // vec2 mouse=vec2(cos(u_time)*0.5,sin(u_time)*0.5);


  // gl_FragColor =mix(image,debug,0.5);

/////

//  CIRCLE ZOOM IN,PINCH OUT
// float radius = 3.;
// float depth = radius/2.;

// float circleSize =33.;

// vec2 uv = u_uvs;

// vec2 distanceFromCenter = uv - center;
// float distXSquared = distanceFromCenter.x * distanceFromCenter.x;
// float distYSquared = distanceFromCenter.y * distanceFromCenter.y;

// float distortionRange = distXSquared * circleSize + distYSquared * circleSize;

// float dx =( distortionRange * depth)/ radius * ( distortionRange / radius -1. );

// //only distort when within  radius
// float mask = distortionRange > radius ? distortionRange : distortionRange + dx;

// vec2 ma = center + ( uv - center ) * mask / distortionRange;

// gl_FragColor = vec4(texture2D(u_image, ma).rgb, 1.); 

///////

// PINCH IN

            // vec2 uv = u_uvs;
            // vec2 mouse= vec2(u_mouseX,u_mouseY);

            // vec2 distanceFromCenter = uv - mouse;
            // float dy= uv.y-mouse.y;
            // float dx=uv.x-mouse.x;
            // float distXSquared = distanceFromCenter.x * distanceFromCenter.x;
            // float distYSquared = distanceFromCenter.y * distanceFromCenter.y;

            // // the bigger the distance, the smaller the distortion

            // float angle = atan(dy, dx);
            // vec2 pct = distanceFromCenter / vec2(0.15,0.15);
            //  float stickyLength =  0.5;


            // float offsetX =uv.x /(cos(angle) * stickyLength * pct.x);
            // float offsetY =uv.y / (sin(angle) * stickyLength * pct.y);

            // gl_FragColor = vec4(texture2D(u_image, vec2(offsetX,offsetY)).rgb, 1.); 


//  TWIRL

// vec2 uv = u_uvs;
// vec2 point=center;
// point=vec2(u_mouseX,u_mouseY);
// float dist= distance(point,uv)/0.5;

// uv *= dist;
// gl_FragColor = vec4(texture2D(u_image, uv).rgb, 1.); 



//  distort from a point

// float distortionFactor=0.2;
// float strength=cos(u_time);
// vec2 uv = u_uvs;
// vec2 point=center;
// point=vec2(u_mouseX,u_mouseY);

// float dist= distance(point,uv);

// uv +=dist * strength * distortionFactor;
// gl_FragColor = vec4(texture2D(u_image, uv).rgb, 1.); 



//  distort from a point

// https://www.shadertoy.com/view/lslGRN

// vec2 uv = u_uvs;
// float strength=4.05;
// vec2 point=center;
// // point=vec2(u_mouseX,u_mouseY);

// float theta  = atan(uv.y-point.y, uv.x-point.x);
// float radius = length(uv);
// radius = pow(radius, strength);
//   uv.x = radius * cos(theta);
//   uv.y = radius * sin(theta);


// gl_FragColor = vec4(texture2D(u_image, uv).rgb, 1.); 

// }




//  pinch from a point

//  https://www.shadertoy.com/view/XlSGRw

// vec2 uv = u_uvs;

// vec2 point=center;
// point=vec2(u_mouseX,u_mouseY);

// vec2 dir = normalize( point - uv );
// float distance = length( center - uv );
// float strength = .3;
// float f = exp( strength * ( distance  - 0.5) ) - 1.;

// gl_FragColor = vec4(texture2D(u_image, uv+f*dir).rgb, 1.); 

// }

//  barrel distortion from 0,0

//   https://www.shadertoy.com/view/MlSXR3

vec2 uv = u_uvs;
vec2 point=center;
point=vec2(u_mouseX,u_mouseY);

// positive values of K1 give barrel distortion, negative give pincushion
    float barrelDistortion1 = 0.0; // K1 in text books
    float barrelDistortion2 = 0.91; // K2 in text books
    float r2 = (point.x-uv.x)*(point.x-uv.x) + (point.y-uv.y)*(point.y-uv.y);
    uv *= 1.0 + barrelDistortion1 * r2 + barrelDistortion2 * r2 * r2;

gl_FragColor = vec4(texture2D(u_image, uv).rgb, 1.); 

}





`;

const uniforms = {
  u_image: PIXI.Texture.from(Image2),
  u_image_alt: PIXI.Texture.from(Image2),
  u_time: 0,
  u_mouseX: 0.5,
  u_mouseY: 0.5,
  u_vp_width: window.innerWidth,
  u_vp_height: window.innerHeight
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
  quad.shader.uniforms.u_time += 0.01;
  quad.shader.uniforms.u_mouseX = mouse.x / window.innerWidth;
  quad.shader.uniforms.u_mouseY = mouse.y / window.innerHeight;
};

const setup = () => {
  app.ticker.add(update);
};

setup();
