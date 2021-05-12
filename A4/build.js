

//Change value in SimplexNoise(--) to generate new seed
let simplex = new SimplexNoise(23);

//building map variables
var buildings = [];
var buildingCount = 50;
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
skyGeometry = new THREE.BoxGeometry(2500, 2500, 2500);

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



// var skybox = null;

// let materialArray = [];
// let texture_ft = new THREE.TextureLoader().load( '/textures/afterrain_ft.jpg');
// let texture_bk = new THREE.TextureLoader().load( '/textures/afterrain_bk.jpg');
// let texture_up = new THREE.TextureLoader().load( '/textures/afterrain_up.jpg');
// let texture_dn = new THREE.TextureLoader().load( '/textures/afterrain_dn.jpg');
// let texture_rt = new THREE.TextureLoader().load( '/textures/afterrain_rt.jpg');
// let texture_lf = new THREE.TextureLoader().load( '/textures/afterrain_lf.jpg');

// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
// materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

// for (let i = 0; i < 6; i++)
//   materialArray[i].side = THREE.BackSide;


// function createSkybox() {
//     // let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
//     // skybox = new THREE.Mesh(skyboxGeo, materialArray);
//     // scene.add(skybox);
// }




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

        //freq higher values, more mountains and rugged terrain
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

            let v =  octave(i / canvas.width, j / canvas.height , 16);
            const per = (100 * v).toFixed(2) + '%';
            c.fillStyle = `rgb(${per},${per},${per})`;
            c.fillRect(i, j, 1, 1);
            
        }
    }
    return c.getImageData(0, 0, canvas.width, canvas.height);
}

var data = generateTexture();

//using "data" to create Terrain
function createTerrain() {

    var geo = new THREE.PlaneGeometry(data.width, data.height, data.width + 1 , data.height);
    geo.colorsNeedUpdate = true;
    geo.verticesNeedUpdate = true;
    geo.computeVertexNormals();

    console.log(geo);
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

            //New Code
            // const position = geo.attributes.position;
            // const v1 = new THREE.Vector3();
            // v1.fromBufferAttribute(position, nn);

            //Old code
            const v1 = geo.vertices[nn];

            //console.log(v1);

            v1.z = map(col, 0, 240, -10, 10) //map from 0:255 to -10:10
            
            //exaggerate the peaks
            //Change interger value in if, to adjust peak sizes. 
            if (v1.z > 5) {
                v1.z *= 1.6;  
            }  
            //v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            //v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
        }
    }
        var mesh = new THREE.Mesh(
            //geo.toNonIndexed(),
            geo, 
            material);
        //mesh.rotateX(-45);
        return mesh;
}

var terrain1 = createTerrain();

terrain1.position.y = -50

function calculateColour() {
    //New Code
    // let indexLength = (terrain1.geometry.attributes.position.array.length);
    //     for (let i = 0; i < indexLength; i+=3) {
    //         //Get three verts for the face
    //         var a = new THREE.Vector3(
    //             terrain1.geometry.attributes.position.getX(i),
    //             terrain1.geometry.attributes.position.getY(i),
    //             terrain1.geometry.attributes.position.getZ(i)
    //         );
    //         var b = new THREE.Vector3(
    //             terrain1.geometry.attributes.position.getX(i + 1),
    //             terrain1.geometry.attributes.position.getY(i + 1),
    //             terrain1.geometry.attributes.position.getZ(i + 1)
    //         );
    //         var c = new THREE.Vector3(
    //             terrain1.geometry.attributes.position.getX(i + 2),
    //             terrain1.geometry.attributes.position.getY(i + 2),
    //             terrain1.geometry.attributes.position.getZ(i + 2)
    //         );

    //         console.log(a);
    //         //If average is below water, set to 0
    //         //alt: color transparent to show the underwater landscape
    //         const avgz = (a.z + b.z + c.z) / 4
    //         if (avgz < 0) {
    //             a.z = 0;
    //             b.z = 0;
    //             c.z = 0;
    //         }
    //         //assign colors based on the highest point of the face
    //         //max is the sea level
    //             const max = Math.max(a.z, Math.max(b.z, c.z))
    //                 if(max <= 0) {
    //                     var colors = new THREE.Color(0x44ccff);
    //                     return terrain1.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //                 }
    //                 if (max <= 0.8) {
    //                     var colors = new THREE.Color(0xeecc44);
    //                     return terrain1.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //                 }
    //                 if (max <= 3.5) {
    //                     var colors = new THREE.Color(0x228800);
    //                     return terrain1.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //                 }
    //                 if (max <= 4) {
    //                     var colors = new THREE.Color(0xcccccc);
    //                     return terrain1.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //                 }
    //                 if (max <= 10) {
    //                     var colors = new THREE.Color(0xc29861);
    //                     return terrain1.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //                 }
    //         var colors = new THREE.Color(0xffffff);
    //         return terrain1.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    //     }

    //Old Code
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
             if(max <= 4)   return f.color.set(0xcccccc);
             if(max <= 10)   return f.color.set(0xc29861);

    //otherwise, return white
    f.color.set('white');
})  
}


var light = new THREE.HemisphereLight(new THREE.Color(1, 1, 1), 1);

function createBuilding() {
    randPos = Math.random()* (10);
    switch (randomSize = Math.floor(Math.random() * 4)) {
        case 1:
            //var geometry = new THREE.BoxGeometry(5, 15, 5);
            //var material = new THREE.MeshBasicMaterial(colorBuilding);
            //var cube = new THREE.Mesh(geometry, material);
            var model = models[0];
            return model;
        case 2:
            // var geometry = new THREE.BoxGeometry(10, 20, 10);
            // var material = new THREE.MeshBasicMaterial(colorBuilding);
            // var cube = new THREE.Mesh(geometry, material);
            var model =  models[1];
            return model;
        case 3:
            // var geometry = new THREE.BoxGeometry(10, 15, 10);
            // var material = new THREE.MeshBasicMaterial(colorBuilding);
            // var cube = new THREE.Mesh(geometry, material);
            var model = models[2];
            return model;

        case 4:
            // var geometry = new THREE.BoxGeometry(10, 20, 10);
            // var material = new THREE.MeshBasicMaterial(colorBuilding);
            // var cube = new THREE.Mesh(geometry, material);
            var model = models[3];
            return model;
        case 5:
            var model = models[4];
            return model;
        case 6:
            var model = models[5];
            return model;   
        case 7:
            var model = models[6];
            return model; 
        case 8:
            var model = models[7];
            return model;   
        
        default:
            // var geometry = new THREE.BoxGeometry(8, 15, 8);
            // var material = new THREE.MeshBasicMaterial(colorBuilding);
            // var cube = new THREE.Mesh(geometry, material);
            var model = models[3];
            return model;
    }
}

function createBuildings() {
    var building = createBuilding();
    buildings.push(building);

    
    let i = randomNumberPosition();
        var positionX = positionsX[i];
        var positionY = positionsY[i];
      
    
    var positionZ = Math.random() * (8 - 5) + 5;
        

    var tra = new THREE.Matrix4();
    tra.makeTranslation(positionX, positionY, positionZ);
    building.applyMatrix(tra);

    building.scale.set(0.01, 0.01, 0.01);
    
    //rotates building to fit plane
    building.rotation.x = 67.5;
    //building.rotation.y = 270; nothing i put here flips the model right way up
        

    group.add(building);
}


var loader = new THREE.OBJLoader();

 function loadModel(model, scale) {
    
     loader.load(

         model,

         function ( object ) {
             if (scale == 'big') {
             object.scale.set(0.000002, 0.000002, 0.000002);
             }
             if (scale == 'small') {
                 object.scale.set(0.0001, 0.0001, 0.0001);
             }
             models.push(object);
             if (models.length == 8) {
                addObjects();
             }
             //return object;
            
         });
    
 }

 function addModels() {

     loadModel('models/40 Bank Street.obj', 'big');
     loadModel('models/BuildingBasic.obj', 'small');
     loadModel('models/CentralPlazaOne.obj', 'big');
     loadModel('models/CentralPlazaTwo.obj', 'big');
     loadModel('models/EmpireSquare.obj', 'big');
     loadModel('models/IndusHouse.obj', 'big');
     loadModel('models/RiverCityApartment.obj', 'big');
     loadModel('models/SunsetResidence.obj', 'big');
     
 }

function randomNumberPosition() {
    return Math.floor(Math.random() * positionsY.length);
}

function findFacePosition() {
        //check faces for position add to array if certain y level
        //console.log(terrain1);

        //New Code
        //Get three verts for each face
        // let indexLength = (terrain1.geometry.attributes.position.array.length);
        // for (let i = 0; i < indexLength; i+=3) {
        //     var a = new THREE.Vector3(
        //         terrain1.geometry.attributes.position.getX(i),
        //         terrain1.geometry.attributes.position.getY(i),
        //         terrain1.geometry.attributes.position.getZ(i)
        //     );
        //     var b = new THREE.Vector3(
        //         terrain1.geometry.attributes.position.getX(i + 1),
        //         terrain1.geometry.attributes.position.getY(i + 1),
        //         terrain1.geometry.attributes.position.getZ(i + 1)
        //     );
        //     var c = new THREE.Vector3(
        //         terrain1.geometry.attributes.position.getX(i + 2),
        //         terrain1.geometry.attributes.position.getY(i + 2),
        //         terrain1.geometry.attributes.position.getZ(i + 2)
        //     );
        //     //console.log(a);
        //     //Store position of each face to check later
        //     var position = new THREE.Vector3();
        //     position.x = (a.x, + b.x, + c.x) / 3;
        //     position.y = (a.y, + b.y, + c.y) / 3;
        //     position.z = (a.z, + b.z, + c.z) / 3;

        //     //console.log(position);
        //     const max = Math.max(a.z, Math.max(b.z, c.z));
        //     // console.log(max);
        //     if (max > 0.8 && max <= 3.5) {
        //         positionsX.push(position.x);
        //         positionsY.push(position.y);
        //     }
        // }


        // Old Code

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
            //console.log(max);
            if(max > 0.8 && max <= 3.5) { 
                positionsX.push(position.x);
                positionsY.push(position.y);
            }

        })  
}

//Michael's Stuff
var plane = null, box = null, cloud = null, boxes = [], cloudsArr = [];
var sun = null, sunPosition;
var moon = null, moonPosition;
var clouds = new THREE.Object3D();
var ambientLight, hemiLight, dirLight, sunPointLight, moonPointLight;
let max = 49, min = -49;

function createPlane() {
    var planeMaterial = new THREE.MeshLambertMaterial();
    planeMaterial.color = new THREE.Color(0.7, 0.7, 0.7);
    //planeMaterial.color = new THREE.Color(0xf9d71c);
    planeMaterial.side = THREE.DoubleSide;

    var planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.castShadow = false; 
    plane.receiveShadow = true;
}

function createBox() {
    var boxMaterial = new THREE.MeshPhongMaterial();
    boxMaterial.color = new THREE.Color(0.5, 0.5 , 0.5);

    var boxGeometry = new THREE.BoxGeometry(1, 1, 2);
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.castShadow = true;
    boxes.push(box);
    scene.add(box);
}

function allocateBoxes(noBoxes) {
    for (let i = 0; i <= noBoxes; i++) {
        createBox();
    }
    boxes.forEach(function(object){
        object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 1)
    });
}

function createLight() {
    hemiLight = new THREE.HemisphereLight(new THREE.Color(0.6, 0.6, 0.6), 0.1);
    hemiLight.skyColor = new THREE.Color(1, 1, 1);
    hemiLight.position.set(0, 0, 100);
}

function createSun() {
    sunPosition = new THREE.Vector3(-5, 3, 100);
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
    sunPointLight.shadow.camera.far = 150;
    sunPointLight.shadow.bias = 0.0001;

    sunPointLight.intensity = 1;
}

function createMoon() {
    moonPosition = new THREE.Vector3(-5, 3, -100);
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
    moonPointLight.shadow.camera.far = 150;
    moonPointLight.shadow.bias = 0.0001;

    moonPointLight.intensity = 0.4;
}

function createCloud() {
//     var cloudMaterial = new THREE.MeshBasicMaterial();
//     cloudMaterial.color = new THREE.Color(1, 1, 1);
//     cloudMaterial.transparent = true;
//     cloudMaterial.opacity = 0.75;
//     var cloudGeometry = new THREE.BoxGeometry(20, 10, 2);
//     cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

//     cloudsArr.push(cloud);
//     clouds.add(cloud);
}

function allocateClouds(noClouds) {
    for (let i = 0; i <= noClouds; i++) {
        createCloud();
    }
    cloudsArr.forEach(function(object){
        object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 80)
    });
}

function createSceneObjects() {
    //createPlane();
    createLight();
    createSun();
    createMoon();
    //allocateBoxes(30);
    allocateClouds(8);
}




function addObjects() {
    scene.add(terrain1);
    scene.add(light);

    scene.add(sun);
    scene.add(moon);
    scene.add(camera);
    //scene.add(hemiLight);
    scene.add(moonPointLight);
    scene.add(sunPointLight);
    scene.add(clouds);

    // Apply Matrix on line 212 seems to not be working - Michael
    // for (let i = 0; i < buildingCount; i++) {
    //     createBuildings();
    // }
    
    scene.add(group);
}
