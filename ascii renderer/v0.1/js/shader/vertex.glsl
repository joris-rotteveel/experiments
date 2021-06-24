varying vec2 vUv;
uniform float time;
void main() {
  vUv = uv;
 // float PI=3.1415925;
  //vec3 newPos= position;
  //newPos.z+=0.1*sin((newPos.x+0.25+time/10.0)*2.0*PI);
  //gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
   gl_Position=projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}