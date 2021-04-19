var terrain = null;
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

    for(let i=0; i < octaves; i++) {
        val += noise(nx * freq ,ny * freq) * amp;
        max += amp;
        amp /= 2;
        freq *= 2;
    }
    return val/max;
}

function generateTexture() {
    const ctx = document.createElement('canvas').getContext('2d');
  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0 , ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < ctx.canvas.width; i++) {
        for (let j = 0; j < ctx.canvas.height; j++) {

            let v =  octave(i / ctx.canvas.width, j / ctx.canvas.height, 16);
            const per = (100 * v).toFixed(2) + '%';
            ctx.fillStyle = `rgb(${per},${per},${per})`;
            ctx.fillRect(i, j, 1, 1);
            
        }
    }
    
    var data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    var geo = new THREE.PlaneGeometry(data.width, data.height, data.width , data.height + 1);

    var material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(1, 1 ,1);
    material.wireframe = true;
    
    for (let j = 0; j < data.height; j++) {
        for (let i = 0; i < data.width; i++) {

            const n =  (j * (data.height) + i);
            const nn = (j * (data.height + 1) + i);
            const col = data.data[n*4]; // the red channel
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

    terrain = new THREE.Mesh(geo, material);
    return terrain;
}

var terrain1 = generateTexture();

function addObjects() {
    scene.add(terrain1);
}
