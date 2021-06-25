precision highp float;

#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

#pragma glslify: aastep = require('glsl-aastep')

varying vec2 vUv;
uniform sampler2D imageTexture;
uniform sampler2D fontTexture;
uniform float time;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}


float draw_circle(vec2 coord, float radius){
    return 1.0-aastep(radius,length(coord-0.5));
}


void main()	{

	vec2 gridSize=vec2(40.0);
	vec2 pixelatedUv=vUv;

	pixelatedUv.x-= mod(pixelatedUv.x, 1.0 / gridSize.x);
	pixelatedUv.y-= mod(pixelatedUv.y, 1.0 / gridSize.y);
	

	vec4 original = texture2D(imageTexture,vUv);
	vec4 pixelColour = texture2D(imageTexture,pixelatedUv);

	// this is called the Luma conversion
	float greyscale = dot(pixelColour.xyz, vec3(0.299, 0.587, 0.114));
	// greyscale represented by " .:-=+*#%@"

	//scale up to the gridsize
	vec2 circlePos = vUv * gridSize;
	//wrap it around between 0-1
	circlePos = fract(circlePos);
	
	
	float circle=draw_circle(circlePos,0.5*greyscale);
	vec4 color = (circle) * pixelColour;
	////// SDF FONT/////////
	//
	// https://github.com/libgdx/libgdx/wiki/Distance-field-fonts
	// https://mattdesl.svbtle.com/material-design-on-the-gpu

	vec2 fontTextureUv = vUv;
	float scaleX =  438.0 / 109.0;
	float scaleY =  438.0 / 10.0;
	vec2 differenceInScale = vec2(scaleX,scaleY);
	//https://thebookofshaders.com/08/ transform
	fontTextureUv= scale( differenceInScale ) * fontTextureUv;
	//move the uv back to top
	fontTextureUv.y -= differenceInScale.y - 1.0;
	//get the scale texture
	vec4 sdf = texture2D(fontTexture, fontTextureUv);


  	gl_FragColor.rgb = vec3(0.0);
  	gl_FragColor.a = step(0.5, sdf.a);
	gl_FragColor = vec4(1.0,1.0,1.0,step(0.5, sdf.a));
	gl_FragColor = sdf;

	// gl_FragColor = vec4(pixelColour);
	// gl_FragColor = vec4(circle);
	//  gl_FragColor = color;
	//  gl_FragColor = original*sdf;
}