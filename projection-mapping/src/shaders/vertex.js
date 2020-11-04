export const vertexShader = `
precision mediump float;

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// our texture matrix uniform
uniform mat4 simplePlaneTextureMatrix;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePosition;
uniform float uMouseMoveStrength;


void main() {

    vec3 vertexPosition = aVertexPosition;

    // // get the distance between our vertex and the mouse position
    // float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));

    // // calculate our wave effect
    // float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));

    // // attenuate the effect based on mouse distance
    // float distanceStrength = (0.4 / (distanceFromMouse + 0.4));

    // // calculate our distortion effect
    // float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;

    // // apply it to our vertex position
    // vertexPosition.z +=  distortionEffect / 30.0;
    // vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
    // vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    // varyings
    vTextureCoord = (simplePlaneTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vVertexPosition = aVertexPosition;
}
`;
