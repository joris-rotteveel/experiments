varying vec2 vUv;
uniform sampler2D imageTexture;
uniform float time;

float draw_circle(vec2 coord, float radius) {
    return step(length(coord), radius);
}

void main()	{

	vec2 gridSize=vec2(40.0);
	vec2 pixelatedUv=vUv;

	pixelatedUv.x-= mod(pixelatedUv.x, 1.0 / gridSize.x);
	pixelatedUv.y-= mod(pixelatedUv.y, 1.0 / gridSize.y);

	vec4 pixelColour = texture2D(imageTexture,pixelatedUv);

	// this is called the Luma conversion
	float greyscale = dot(pixelColour.xyz, vec3(0.299, 0.587, 0.114));

	//scale up to the gridsize
	vec2 circlePos=vUv * gridSize;
	//wrape it around between 0-1
	circlePos=fract(circlePos);
	vec2 center=vec2(0.5);
	float circle=draw_circle(circlePos-center,0.5*greyscale);



	gl_FragColor = vec4(pixelColour);
	gl_FragColor = vec4(circle);
}