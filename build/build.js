var mesh = null;
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
                v1.z *= 2;  
            }  
            //v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            //v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
        }
    }
        mesh = new THREE.Mesh(geo, material);
        return mesh;
}

var terrain1 = createTerrain();

function calculateColour() {
    //for every face
    terrain1.geometry.faces.forEach(f=>{
    //get three verts for the face
        const a = terrain1.geometry.vertices[f.a]
        const b = terrain1.geometry.vertices[f.b]
        const c = terrain1.geometry.vertices[f.c]

    //if average is below water, set to 0
    //alt: color transparent to show the underwater landscape
        const avgz = (a.z+b.z+c.z)/3
            if(avgz < 0) {
                a.z = 0
                b.z = 0
                c.z = 0
          }


    //assign colors based on the highest point of the face
        const max = Math.max(a.z,Math.max(b.z,c.z))
             if(max <=0)   return f.color.set(0x44ccff)
             if(max <=1.5) return f.color.set(0x228800)
             if(max <=3.5) return f.color.set(0xeecc44)
             if(max <=5)   return f.color.set(0xcccccc)

    //otherwise, return white
    f.color.set('white')
})
    terrain1.geometry.colorsNeedUpdate = true;
    terrain1.geometry.verticesNeedUpdate = true;
    terrain1.geometry.computeVertexNormals();

     terrain = new THREE.Mesh(terrain1.geometry, new THREE.MeshLambertMaterial({
        // wireframe:true,
        vertexColors: THREE.VertexColors,
        //required for flat shading
        flatShading:true,
    }))

    terrain .position.y = -0;
    terrain .position.z = -20;

    return terrain ;

}

var colorTerrain = calculateColour();

function addObjects() {
    //scene.add(terrain1);
    scene.add(colorTerrain);
}
