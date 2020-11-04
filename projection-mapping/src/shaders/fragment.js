export const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D simplePlaneTexture;
uniform vec2 u_resolution;
uniform vec2 uMousePosition;
uniform float uTime;


float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float convert(float value){
    return map(value,-1.0,1.0,0.0,1.0);
}




vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (2.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
  
    
    vec2 normalised=vec2(convert(vVertexPosition.x),convert(vVertexPosition.y));
    // float pct = 0.0;
    // vec3 color = vec3(pct);
    // gl_FragColor = vec4( color, 1 );
    ///////
 
    vec3 alpha = vec3(0.0);
    vec2 pos = vec2(normalised*2.);

    float DF = 0.0;

    // Add a random position
    float a = 0.0;
    vec2 vel = vec2(uTime*.1);
//    DF += snoise(pos+vel)*.25+.25;

    // Add a random position
    a = snoise(pos*vec2(cos(uTime*0.15),sin(uTime*0.1))*0.1)*3.1415;
    vel = vec2(cos(a),sin(a));
    // DF += snoise(pos+vel)*.25+.25;
    float spacingBetweenLines=0.30;//snoise(vec2(cos(uTime*0.5),sin(uTime*0.5))*0.1)*3.1415;
    DF += snoise(pos+vel)*spacingBetweenLines+spacingBetweenLines;

    alpha = vec3( step(.1,fract(DF)) );

    float radius=0.5;
    
    
    float distToMouse = distance(vec2(vVertexPosition.x, vVertexPosition.y), uMousePosition);
    
    //fade the edges based on distance to mouse
     alpha+=distToMouse*2.0;

    //anything outside the mask needs to be black
    if(distToMouse>(radius*1.0)){
        //black
       alpha=vec3(.5);
    }

    gl_FragColor = vec4(1.0-alpha,1.0);
    gl_FragColor = vec4(vTextureCoord,1.0-alpha);

    gl_FragColor = vec4(1.0-alpha,1.0);
    gl_FragColor = vec4(vVertexPosition,1.0);
    vec4 texture = texture2D(simplePlaneTexture, vTextureCoord);
    
    gl_FragColor=vec4(0.,0.,0.,alpha);
    // gl_FragColor=vec4(vec3(alpha),1.);
    
}

`;
