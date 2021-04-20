var mesh = null;
let simplex = new SimplexNoise(4);

function map(val, smin, smax, emin, emax) {
    const t =  (val - smin) / (smax - smin);
    return (emax - emin) * t + emin;
}

function noise(nx, ny) {
    return map(simplex.noise2D(nx, ny), -1, 1, 0, 1);
}

//stack some noisefields together
function octave(nx, ny, octaves) {
    let val = 0;
    let freq = 1;
    let max = 0;
    let amp = 1;

    for(let i = 0; i < octaves; i++) {
        val += noise(nx * freq ,ny * freq) * amp;
        max += amp;
        amp /= 2;
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

    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {

            let v =  octave(i / canvas.width, j / canvas.height, 16);
            const per = (100 * v).toFixed(2) + '%';
            c.fillStyle = `rgb(${per},${per},${per})`;
            c.fillRect(i, j, 1, 1);
            
        }
    }
    return c.getImageData(0, 0, canvas.width, canvas.height);
}

    //using "data" to create Terrain
    function createTerrain() {

    var data = generateTexture();
    var geo = new THREE.PlaneGeometry(data.width, data.height, data.width + 1 , data.height + 1);

    var material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(1, 1 ,1);
    material.wireframe = true;
    
    for (let j = 0; j < data.height * 2; j++) {
        for (let i = 0; i < data.width; i++) {

            const n =  (j * (data.height) + i);
            const nn = (j * (data.height + 1) + i);
            
            const col = data.data[n  *4]; // the red channel
            const v1 = geo.vertices[nn];

            v1.z = map(col, 0, 200, -10, 10) //map from 0:255 to -10:10
            
            //exaggerate the peaks
            if (v1.z > 2.5) {
                v1.z *= 1.3;  
            }  
            //v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            //v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
        }
    }
        mesh = new THREE.Mesh(geo, material);
        return mesh;
}

var terrain1 = createTerrain();

function addObjects() {
    scene.add(terrain1);
}
