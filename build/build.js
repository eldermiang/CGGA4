let simplex = new SimplexNoise(4);

let mtlloader = new THREE.MTLLoader();

var data;
var geo;
var n;
var nn;
var col;
var v1;

//building map variables
var gridSize = 15;
var buildingMap;
var buildings = [];
var buildingCount = 1000;
var buildingBuilt;
var group = new THREE.Group();
var color = new THREE.Color(0xA9A9A9);
var positions = []

//end building map variables


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

    data = generateTexture();

    geo = new THREE.PlaneGeometry(data.width, data.height, data.width + 1 , data.height);
    geo.colorsNeedUpdate = true;
    geo.verticesNeedUpdate = true;
    geo.computeVertexNormals();

    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = true;
    material.wireframe = false;
    //material.flatShading = true;
    
    
    for (let j = 0; j < data.height * 2; j++) {
        for (let i = 0; i < data.width; i++) {

            n =  (j * (data.height) + i);
            nn = (j * (data.height + 1) + i);
            
            const col = data.data[n  *4]; // the red channel
            v1 = geo.vertices[nn];

            v1.z = map(col, 0, 240, -10, 10) //map from 0:255 to -10:10
            
            //exaggerate the peaks
            if (v1.z > 2.5) {
                v1.z *= 1.6;  
            }  
            //v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            //v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
        }
    }
        var mesh = new THREE.Mesh(geo, material);

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
        const avgz = (a.z+b.z+c.z) / 4
            if(avgz < 0) {
                a.z = 0;
                b.z = 0;
                c.z = 0;
          }

    //assign colors based on the highest point of the face
    //max is the sea level
        const max = Math.max(a.z,Math.max(b.z,c.z))
             if(max <= 0)   return f.color.set(0x44ccff);
             if(max <= 0.8) return f.color.set(0xeecc44);
             if(max <= 3.5) return f.color.set(0x228800);
             if(max <= 5)   return f.color.set(0xcccccc);
             if(max > 4)   return f.color.set(0xcc412c);

    //otherwise, return white
    f.color.set('white');
})  
}

function createBuilding() {
   
    switch (randomSize = Math.random(1,4)) {
        case 1:
            var geometry = new THREE.BoxGeometry(5, 15, 5);
            var material = new THREE.MeshBasicMaterial(color);
            var cube = new THREE.Mesh(geometry, material);
            return cube;
        case 2:
            var geometry = new THREE.BoxGeometry(30, 20, 30);
            var material = new THREE.MeshBasicMaterial(color);
            var cube = new THREE.Mesh(geometry, material);
            return cube;
        case 3:
            var geometry = new THREE.BoxGeometry(10, 15, 10);
            var material = new THREE.MeshBasicMaterial(color);
            var cube = new THREE.Mesh(geometry, material);
            return cube;

        case 4:
            var geometry = new THREE.BoxGeometry(10, 20, 10);
            var material = new THREE.MeshBasicMaterial(color);
            var cube = new THREE.Mesh(geometry, material);
            return cube;
        default:
            var geometry = new THREE.BoxGeometry(8, 15, 8);
            var material = new THREE.MeshBasicMaterial(color);
            var cube = new THREE.Mesh(geometry, material);
            return cube;
    }
}

function createBuildings() {
    var building = createBuilding();
    buildings.push(building);

    var z
    for (z = 0; i < positions.length; i++){
        var positionX = positions[z];
        var positionY = positions[z+1];
    }
    var positionZ = Math.random() * (8 - 5) + 5;
        
   
    //assign X and z position of building
    // building.position.x = positionX;
    // building.position.z = positionZ;

    var tra = new THREE.Matrix4();
    tra.makeTranslation(positionX, positionY, positionZ);
    building.applyMatrix(tra);

    //rotates building to fit plane
    // building.position.y = positionY;
    building.rotation.x = 67.5;
        
   

    group.add(building);
}

function findFacePosition() {
        //check faces for position add to array if certain y level
        terrain1.geometry.faces.forEach(f=>{
        
            //get three verts for the face
                const a = terrain1.geometry.vertices[f.a]
                const b = terrain1.geometry.vertices[f.b]
                const c = terrain1.geometry.vertices[f.c]
        
            //store position of each face to check later
            var position = new THREE.Vector3();
            position.x = (a.x + b.x + c.x) / 3;
            position.y = (a.y + b.y + c.y) / 3;
            position.z = (a.z + b.z + c.z) / 3;

            const max = Math.max(a.z,Math.max(b.z,c.z))

            if(max > 0.8 && max <= 3.5) { 
                positions.push(position.x);
                positions.push(position.y);
            }

        })  
}

function addObjects() {
    scene.add(terrain1);
    for (i = 0; i < buildingCount; i++) {
        createBuildings();
    }
    
    scene.add(group);
}
