
//Terrain Variables

//Change value in SimplexNoise(--) to generate new seed
// let simplex = new SimplexNoise(23);
var randomSeed = getRandomIntBetween(0, 100);
let simplex = new SimplexNoise(randomSeed);

//Number of noise fields being stacked
//Default: 16
var octaves = 16;

//Frequency of the Noise (wavelength)
//Default: 1
var frequency = 4;

//Max = "Elevation". Lower Values, more Mountrains. Higer values, higher water level.
//Range between -0.5 to 1
//Default: 0
var elevation = 0;

//Range between 1 to 2.5
//Higer values, more flat, lower values, more rugged
//Default: 2
var amplitude = 2.5;

//1 to 6
//Default: 1.6
var peakHeight = 1.6;

//Canvas/Image variables: Width has to be 2 times more than height
var terrainSize = 100;

var tGeo;

//building map variables
var buildings = [];
var buildingCount = 100;
var group = new THREE.Group();
var colorBuilding = new THREE.Color(0x4287f5);
var positionsX = []
var positionsY = []
var randPos;
var models = [];

//end building map variables

var skyBox = null;
var skyGeometry = null;

var path = "/textures/";
var directions = ["corona_ft", "corona_bk", "corona_up", "corona_dn", "corona_rt", "corona_lf"];
var format = ".png";

function createSkybox() {
skyGeometry = new THREE.BoxGeometry(2000, 2000, 2000);

var materialArray = [];
for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(path + directions[i] + format),
        side: THREE.BackSide
    }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);
    skyBox.rotation.x = 89.5;
}
}


function map(val, smin, smax, emin, emax) {
    const t =  (val - smin) / (smax - smin);
    return (emax - emin) * t + emin;
}

function noise(nx, ny) {
    return map(simplex.noise2D(nx, ny), -1, 1, 0, 1);
}

//Stack noisefields together
function octave(nx, ny, octaves) {
    let val = 0;
    let freq = frequency;
    let max = elevation;
    let amp = 1;

    for(let i = 0; i < octaves; i++) {
        val += noise(nx * freq ,ny * freq) * amp;
        max += amp;
        amp /= amplitude;
        freq *= 2;
    }
    return val/max;
}

//Generate Perlin Noise Image
function generateTexture() {
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d')
  
    c.fillStyle = 'black';
    c.fillRect(0, 0 , canvas.width, canvas.height);

    canvas.height = terrainSize;
    canvas.width = terrainSize * 2;

    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {

            let v =  octave(i / canvas.width, j / canvas.height , octaves);
            const per = (100 * v).toFixed(2) + '%';
            c.fillStyle = `rgb(${per},${per},${per})`;
            c.fillRect(i, j, 1, 1);
            
        }
    }
    return c.getImageData(0, 0, canvas.width, canvas.height);
}

var data = generateTexture();

//Using "data" to create Terrain
function createTerrain() {

    tGeo = new THREE.PlaneGeometry(data.width, data.height * 2, data.width + 1 , data.height);
    tGeo.colorsNeedUpdate = true;
    tGeo.verticesNeedUpdate = true;
    tGeo.computeVertexNormals();

    //var material = new THREE.MeshBasicMaterial();
    var material = new THREE.MeshStandardMaterial({  
        
        metalness: 0.1,
        shading: THREE.FlatShading} )

    material.vertexColors = true;
    
    
    for (let j = 0; j < data.height * 2 ; j++) {
        for (let i = 0; i < data.width; i++) {

            const n =  (j * (data.height) + i);
            const nn = (j * (data.height + 1) + i);
            
            const col = data.data[n  *4]; // the red channel
            const v1 = tGeo.vertices[nn];

            v1.z = map(col, 0, 240, -10, 10) //map from 0:255 to -10:10
            
            //exaggerate the peaks
            //Change interger value in if, to adjust peak sizes. 
            if (v1.z > 5) {
                v1.z *= peakHeight;  
            }  
            //v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            //v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
        }
    }
        var mesh = new THREE.Mesh(
            //geo.toNonIndexed(),
            tGeo, 
            material);
        //mesh.rotateX(-45);
        mesh.traverse(function(child){
            child.castShadow = true;
            child.receiveShadow = true;
        })
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
    //max is the sea level/elevation
        const max = Math.max(a.z,Math.max(b.z,c.z))
        
             //Water
             if(max <= 0)   return f.color.set(0x67E6FF);
             //Beaches
             if(max <= 0.8) return f.color.set(0xF4E459);
             //Land
             if(max <= 5) return f.color.set(0x228800);
             //Mountain Cliifs
             if(max <= 10)   return f.color.set(0xc29861);
             //Mountain Peaks
             if(max > 15)   return f.color.set(0xcccccc);
            
    //otherwise, return white
    f.color.set(0xFFFFFF);

})  
}

var light = new THREE.HemisphereLight(new THREE.Color(1, 1, 1), 1);

function createBuilding() {
    randPos = Math.random()* (10);
    switch (randomSize = Math.floor(Math.random() * 7)) {

        //get a random model from the array and 
        //return a clone of it
        case 1:
            var model = models[0].clone();
            return model;
        case 2:
            var model =  models[1].clone();
            return model;
        case 3:
            var model = models[2].clone();
            return model;

        case 4:
            var model = models[3].clone();
            return model;
        case 5:
            var model = models[4].clone();
            return model;
        case 6:
            var model = models[5].clone();
            return model;   
        case 7:
            var model = models[6];
            return model; 
        case 8:
            var model = models[7];
            return model;   
        
        default:
            var model = models[3];
            return model;
    }
}

function createBuildings() {

    //get a random model and add it to the buildings array
    var building = createBuilding();
    buildings.push(building);

    var index = getRandomIntBetween(0, positionsY.length);

    //translate building
    var tra = new THREE.Matrix4();
    tra.makeTranslation(positionsX[index], positionsY[index], 0);
    building.applyMatrix(tra);

    //scale building
    building.scale.set(0.0025, 0.0025, 0.0025);
    
    //rotate building to fit plane
    building.rotation.x = 67.5;
    
    //allow buildings to receive and cast shadows
    building.traverse(function(child){
        child.castShadow = true;
        child.receiveShadow = true;
    });

    group.add(building);
}


var loader = new THREE.OBJLoader();

 function loadModel(model, scale) {
    
    loader.load(

        model,

        //scale the model accordingly
        function ( object ) {
            if (scale == 'big') {
            object.scale.set(0.000002, 0.000002, 0.000002);
            }
            if (scale == 'small') {
                object.scale.set(0.0001, 0.0001, 0.0001);
            }

            //flip the model upside down
            var flip = new THREE.Matrix4().makeScale(1,-1,1);
            object.applyMatrix(flip);

            //add it to the models array
            models.push(object);
            if (models.length == 7) {
               addObjects();
            }
           
        });
    
 }

 function addModels() {

    //calls the load model function on each model.obj

     loadModel('models/40 Bank Street.obj', 'big');
     loadModel('models/BuildingBasic.obj', 'small');
     loadModel('models/CentralPlazaOne.obj', 'big');
     //loadModel('models/CentralPlazaTwo.obj', 'big');
     loadModel('models/EmpireSquare.obj', 'big');
     loadModel('models/IndusHouse.obj', 'big');
     loadModel('models/RiverCityApartment.obj', 'big');
     loadModel('models/SunsetResidence.obj', 'big');
     
 }

function getRandom(min, max) {

    //return a random number (with 
    //decimals) between min and max
    return Math.random() * (max - min) + min;
  }

  function getRandomIntBetween(min, max) {

    //return a random integer between min and max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//checks the terrain for green faces and 
//adds it to the positions array
function findFacePosition() {
        //check faces for position add to array if certain y level
        terrain1.geometry.faces.forEach(f=>{
            //console.log(f);
            //get three verts for the face
                const a = terrain1.geometry.vertices[f.a]
                const b = terrain1.geometry.vertices[f.b]
                const c = terrain1.geometry.vertices[f.c]
        
                //console.log(a);
            //store position of each face to check later
            var position = new THREE.Vector3();
            position.x = (a.x + b.x + c.x) / 3;
            position.y = (a.y + b.y + c.y) / 3;
            position.z = (a.z + b.z + c.z) / 3;
            // console.log(position);
            const max = Math.max(a.z,Math.max(b.z,c.z))
            //add green positions to the positions array
            if(max > 0.8 && max <= 3.5) { 
                positionsX.push(position.x);
                positionsY.push(position.y);
            }

        })  
}

//Weather variables & functions
var plane = null, box = null, cloud = null, boxes = [], cloudsArr = [], cloudsArr2 = [];

var sun = null, sunPosition;
var moon = null, moonPosition;

var clouds = new THREE.Object3D();
var clouds2 = new THREE.Object3D();

var ambientLight, hemiLight, dirLight, sunPointLight, moonPointLight;
let max = 49, min = -49;

//Create a generic lighting environment
function createLight() {
    hemiLight = new THREE.HemisphereLight(new THREE.Color(0.6, 0.6, 0.6), 0.1);
    hemiLight.skyColor = new THREE.Color(1, 1, 1);
    hemiLight.position.set(0, 0, 100);
}

//create the sun
function createSun() {
    sunPosition = new THREE.Vector3(-5, 3, 300);
    var sunMaterial = new THREE.MeshBasicMaterial();
    sunMaterial.color = new THREE.Color(0xf9d71c);

    var sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);

    sunPointLight = new THREE.PointLight(new THREE.Color(0xf9d71c), 1, 1000, 0);
    sunPointLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    sunPointLight.castShadow = true;

    sunPointLight.shadow.mapSize.width = 2048;
    sunPointLight.shadow.mapSize.height = 2048;
    sunPointLight.shadow.mapSize.radius = 2;
    sunPointLight.shadow.bias = 0.0001;

    sunPointLight.intensity = 1;
}

//create the moon
function createMoon() {
    moonPosition = new THREE.Vector3(-5, 3, -300);
    var moonMaterial = new THREE.MeshBasicMaterial();
    moonMaterial.color = new THREE.Color(0xeaf4fc);

    var moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(moonPosition.x, moonPosition.y, moonPosition.z);

    moonPointLight = new THREE.PointLight(new THREE.Color(0xeaf4fc), 1, 1000, 0);
    moonPointLight.position.set(moonPosition.x, moonPosition.y, moonPosition.z);
    moonPointLight.castShadow = true;

    moonPointLight.shadow.mapSize.width = 2048;
    moonPointLight.shadow.mapSize.height = 2048;
    moonPointLight.shadow.mapSize.radius = 2;
    moonPointLight.shadow.bias = 0.0001;

    moonPointLight.intensity = 0.4;
}

//create a cloud in the primary group / array
function createCloud() {
    var cloudMaterial = new THREE.MeshBasicMaterial();
    cloudMaterial.color = new THREE.Color(1, 1, 1);
    cloudMaterial.transparent = true;
    cloudMaterial.opacity = 0.75;
    var cloudGeometry = new THREE.BoxGeometry(20, 10, 2);
    cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.castShadow = true;
    //console.log(cloud);

    cloudsArr.push(cloud);
    clouds.add(cloud);
}

//create a cloud in the secondary group / array
function createCloudSecondary() {
    var cloudMaterial = new THREE.MeshBasicMaterial();
    cloudMaterial.color = new THREE.Color(1, 1, 1);
    cloudMaterial.transparent = true;
    cloudMaterial.opacity = 0.75;
    var cloudGeometry = new THREE.BoxGeometry(20, 10, 2);
    cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.castShadow = true;
    //console.log(cloud);

    cloudsArr2.push(cloud);
    clouds2.add(cloud);
}

//creates as many clouds as specified in noClouds
function allocateClouds(noClouds) {
    for (let i = 0; i <= noClouds; i++) {
        createCloud();
    }
    cloudsArr.forEach(function(object){
        object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 80);
    });
}

function allocateCloudsSecondary(noClouds) {
    for (let i = 0; i <= noClouds; i++) {
        createCloudSecondary();
    }
    cloudsArr2.forEach(function(object){
        object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 80);
    });
}

function disableRain() {
    console.log(rain);
    rain.traverse(function(child){
        child.visible = false;
    });
    console.log(rain);
}

//calls the weather creation functions
function createSceneObjects() {
    createLight();
    createSun();
    createMoon();
    allocateClouds(8);
    allocateCloudsSecondary(8);
}

//add all the elements to the scene
function addObjects() {
    scene.add(terrain1);
    scene.add(light);

    scene.add(sun);
    scene.add(moon);
    scene.add(moonPointLight);
    scene.add(sunPointLight);
    scene.add(clouds);
    scene.add(clouds2);

    for (let i = 0; i < buildingCount; i++) {
        createBuildings();
    }
    
    scene.add(group);
}
