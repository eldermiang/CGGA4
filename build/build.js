//Change value in SimplexNoise(--) to generate new seed
let simplex = new SimplexNoise(1);

//Number of noise fields stacks
var octaves = 5;

function map(val, smin, smax, emin, emax) {
    const t =  (val - smin) / (smax - smin);
    return (emax - emin) * t + emin;
}

function noise(nx, ny) {
    return simplex.noise2D(nx, ny)/2 + 0.5;
}

//stack some noisefields together
function octave(nx, ny, octaves) {
    let val = 0;
    //Default
    //let freq = 1;
    let freq = 4;
    //Max = "Elevation". Lower Values, more Mountrains. Higer values, higher water level.
    //Range between -0.5 to 1
    let max = 0;
    let amp = 1;
    
    
    for(let i = 0; i < octaves; i++) {
        val += noise(nx * freq ,ny * freq) * amp;
        max += amp;

        //Range between 1.5 to 2.5
        amp /= 1.7;
        freq *= 2;
    }
    return val/max;
}

//generate Perlin Noise Image
function generateTexture() {
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d')
  
    c.fillStyle = 'black';
    c.fillRect(0, 0 , canvas.width, canvas.height);

    canvas.height = 100;
    canvas.width = 200;

    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            
            let v =  octave(i / canvas.width, j / canvas.height, octaves);
            const per = (100 * v).toFixed(2) + '%';
            c.fillStyle = `rgb(${per},${per},${per})`;
            c.fillRect(i, j, 1, 1);
            
        }
    }
    return c.getImageData(0, 0, canvas.width, canvas.height);
}

var image1 = generateTexture();

//using "data" to create Terrain
function createTerrain(data) {
    var geo = new THREE.PlaneGeometry(data.width, data.height * 2, data.width + 1 , data.height);
    geo.colorsNeedUpdate = true;
    geo.verticesNeedUpdate = true;
    geo.computeVertexNormals();

    //var material = new THREE.MeshBasicMaterial();
    var material = new THREE.MeshStandardMaterial({  
        
        //metalness: lower value, the more brighter 
        metalness: 0.1,
        shading: THREE.FlatShading} )

    material.vertexColors = true;
    //material.wireframe = true;
    
    for (let j = 0; j < data.height * 2 ; j++) {
        for (let i = 0; i < data.width; i++) {

            const n =  (j * (data.height) + i);
            const nn = (j * (data.height + 1) + i);
            
            const col = data.data[n  *4]; // the red channel
            const v1 = geo.vertices[nn];

            v1.z = map(col, 0, 240, -10, 10) //map from 0:255 to -10:10
            
            //exaggerate the peaks
            //Change interger value in if, to adjust peak sizes. 
            if (v1.z > 5) {
                v1.z *= 1.6;  
            }  

            // v1.x += map(Math.random(), 0 , 1, -0.5, 0.5) //jitter x
            // v1.y += map(Math.random(), 0 , 1, -0.5, 0.5) //jitter y

            // v1.x += map(Math.random(), -1 , 1, -0.5, 0.5) //jitter x
            // v1.y += map(Math.random(), -1 , 1, -0.5, 0.5) //jitter y

        }
    }
        var mesh = new THREE.Mesh(geo, material);
        return mesh;
}

var terrain1 = createTerrain(image1);

var colour1 = calculateColour(terrain1);


function calculateColour(terrain) {
    //for every face
    terrain.geometry.faces.forEach(f=>{
        
    //get three verts for the face
        const a = terrain.geometry.vertices[f.a]
        const b = terrain.geometry.vertices[f.b]
        const c = terrain.geometry.vertices[f.c]

    //if average is below water, set to 0
        const avgz = (a.z + b.z + c.z) / 3
            if(avgz < 0) {
                a.z = 0;
                b.z = 0;
                c.z = 0;
          }

    //assign colors based on the highest point of the face
    //max is the sea level
        const max = Math.max(a.z , Math.max(b.z, c.z))
        
             //Water
             if(max <= 0)   return f.color.set(0x67E6FF);
             //Beaches
             if(max <= 0.8) return f.color.set(0xF4E459);
             //Land
             if(max <= 3.5) return f.color.set(0x228800);
             //Mountain Cliifs
             if(max <= 4)   return f.color.set(0xcccccc);
             //Mountain Peaks
             if(max <= 10)   return f.color.set(0xc29861);

    //otherwise, return white
    f.color.set('white');
})  
}

var light = new THREE.HemisphereLight(new THREE.Color(1, 1, 1), 1);
var group = new THREE.Group();

function addObjects() {
    terrain1.position.x = 0;
    terrain1.position.y = 0;
    terrain1.position.z = 0;
    //terrain1.rotateX(-45);
    //scene.add(terrain1);

    // terrain2.position.x = 0;
    // terrain2.position.y = image1.height;
    // terrain2.position.z = -4;
    // terrain2.rotateX(135);
    // terrain2.rotateY(135.1);
    //scene.add(terrain2);

    group.add(terrain1);
    //group.add(terrain2);
    group.rotateX(-45);
    scene.add(group);
    
    scene.add(light);
    
    
    
}
