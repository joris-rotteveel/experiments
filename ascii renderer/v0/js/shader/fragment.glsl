varying vec2 vUv;
uniform sampler2D imageTexture;
uniform float time;

// float draw_circle(vec2 coord, float radius) {
	
//     return step(length(coord), radius);
// }

float draw_circle(vec2 coord, float radius){
    return step(length(coord-0.5), radius);
	}


void main()	{

	vec2 gridSize=vec2(70.0);
	vec2 pixelatedUv=vUv;

	pixelatedUv.x-= mod(pixelatedUv.x, 1.0 / gridSize.x);
	pixelatedUv.y-= mod(pixelatedUv.y, 1.0 / gridSize.y);
	

	vec4 pixelColour = texture2D(imageTexture,pixelatedUv);

	// this is called the Luma conversion
	float greyscale = dot(pixelColour.xyz, vec3(0.299, 0.587, 0.114));

	//scale up to the gridsize
	vec2 circlePos=vUv * gridSize;
	//animate the position
 	 float time = time*0.2;
	  float offset= 2.0;
    if( fract(time)>0.5 ){
        if (fract( circlePos.y * 0.5) > 0.5){
            circlePos.x += fract(time)*offset;
        } else {
            circlePos.x -= fract(time)*offset;
        }
    } else {
        if (fract( circlePos.x * 0.5) > 0.5){
           circlePos.y += fract(time)*offset;
        } else {
           circlePos.y -= fract(time)*offset;
        }
    }
          
        

	//wrape it around between 0-1
	circlePos=fract(circlePos);
	
	
	float shape=draw_circle(circlePos,0.25*greyscale);

	vec4 color = (shape) * pixelColour;



	gl_FragColor = vec4(pixelColour);
	gl_FragColor = vec4(shape);
	// gl_FragColor=color;
}