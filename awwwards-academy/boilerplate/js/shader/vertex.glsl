varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 newPos= position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}