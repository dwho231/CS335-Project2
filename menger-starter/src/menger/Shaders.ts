export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;   
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
		
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;

// TODO: Write the fragment shader

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;    
	
    
    void main () {
		vec3 color;
		if (normal.xyz == vec3(1.0, 0.0, 0.0) || normal.xyz == vec3(-1.0, 0.0, 0.0)) {
			color = vec3(1.0, 0.0, 0.0);
		} else if (normal.xyz == vec3(0.0, 1.0, 0.0) || normal.xyz == vec3(0.0, -1.0, 0.0)) {
			color = vec3(0.0, 1.0, 0.0);
		} else if (normal.xyz == vec3(0.0, 0.0, 1.0) || normal.xyz == vec3(0.0, 0.0, -1.0)) {
			color = vec3(0.0, 0.0, 1.0);
		}
		float diffuse = dot(normal.xyz, normalize(lightDir.xyz));
		gl_FragColor = vec4(color * diffuse, 1.0);
	}
`;

// TODO: floor shaders

// export let floorVSText = ``;
//export let floorFSText = ``;
// Floor shaders

export let floorVSText = `
    precision mediump float;

    attribute vec4 vertPosition;
    attribute vec4 aNorm;

    varying vec4 lightDir;
    varying vec4 normal;
    varying vec4 worldPos;
    varying vec4 viewPos;

    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main () {
        worldPos = mWorld * vertPosition;
        viewPos = mView * worldPos;
        gl_Position = mProj * viewPos;

        lightDir = lightPosition - worldPos;
        normal = aNorm;
    }
`;

export let floorFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;
    varying vec4 worldPos;
    varying vec4 viewPos;

    void main () {
        vec3 N = normalize(normal.xyz);
        vec3 L = normalize(lightDir.xyz);

        float diffuse = max(dot(N, L), 0.0);
        float ambient = 0.20;

        float cellSize = 5.0;
        float xCell = floor(worldPos.x / cellSize);
        float zCell = floor(worldPos.z / cellSize);
        float checker = mod(xCell + zCell, 2.0);

        vec3 baseColor;
        if (checker < 1.0) {
            baseColor = vec3(0.0, 0.0, 0.0);
        } else {
            baseColor = vec3(1.0, 1.0, 1.0);
        }

        vec3 litColor = baseColor * (ambient + 0.55 * diffuse);

        float depth = -viewPos.z;

        float farFade = smoothstep(12.0, 65.0, depth);

        /* curve the fade */
        farFade = farFade * farFade * farFade * farFade;
        vec3 color = litColor * (1.0 - 0.8 * farFade);

        gl_FragColor = vec4(color, 1.0);
    }
`;
