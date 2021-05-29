//Weather variables & functions
var cloud = null, boxes = [], cloudsArr = [], cloudsArr2 = [];

var sun = null, sunPosition;
var moon = null, moonPosition;

var clouds = new THREE.Object3D();
var clouds2 = new THREE.Object3D();

var ambientLight, hemiLight, dirLight, sunPointLight, moonPointLight;
let max = 49, min = -49;

var sunGlow, moonGlow;

//Create a generic lighting environment
//Not used
function createLight() {
    hemiLight = new THREE.HemisphereLight(new THREE.Color(0.6, 0.6, 0.6), 0.1);
    hemiLight.skyColor = new THREE.Color(1, 1, 1);
    hemiLight.position.set(0, 0, 100);
}

//create the sun
function createSun() {
    sunPosition = new THREE.Vector3(-5, 3, 300);
    var sunMaterial = new THREE.MeshLambertMaterial();
    sunMaterial.emissive = new THREE.Color(0xf9d71c);
    sunMaterial.color = new THREE.Color(0xf9d71c);

    var sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);

    sunGlow = createGlow(sunMaterial.color, sunPosition);

    //Create a pointlight at sun position
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
    var moonMaterial = new THREE.MeshLambertMaterial();
    moonMaterial.emissive = new THREE.Color(0xeaf4fc);
    moonMaterial.color = new THREE.Color(0xeaf4fc);
    moonMaterial.side = THREE.BackSide;

    var moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(moonPosition.x, moonPosition.y, moonPosition.z);

    moonGlow = createGlow(moonMaterial.color, moonPosition);

    //Create a pointlight at moon position
    moonPointLight = new THREE.PointLight(new THREE.Color(0xeaf4fc), 1, 1000, 0);
    moonPointLight.position.set(moonPosition.x, moonPosition.y, moonPosition.z);
    moonPointLight.castShadow = true;

    moonPointLight.shadow.mapSize.width = 2048;
    moonPointLight.shadow.mapSize.height = 2048;
    moonPointLight.shadow.mapSize.radius = 2;
    moonPointLight.shadow.bias = 0.0001;

    moonPointLight.intensity = 0.4;
}

//Create custom Shader object - Sun / Moon Glow
function createGlow(color, position) {

    var geometry = new THREE.SphereBufferGeometry(5, 64, 64);

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms:
        {
            c : {type: "float", value: 0.6},
            p : {type: "float", value: 4},
            glowColor: {type: "vec3", value: color},
            viewVector: {type: "vec3", value: camera.position}
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });

    var starGlow = new THREE.Mesh(geometry, shaderMaterial);
    starGlow.scale.multiplyScalar(1.5);
    starGlow.position.set(position.x, position.y, position.z);
    console.log(starGlow);
    return starGlow;
}

// //create a cloud in the primary group / array
function createCloud() {
    var geo = new THREE.Geometry();

    var bodyRadius = 2;

    // var cloudBigBody = new THREE.SphereGeometry(bodyRadius * 1.2, 8, 8);
    // cloudBigBody.scale(1, 1.2, 0.7);
    // geo.merge(cloudBigBody);

    var cloudBody = new THREE.SphereGeometry(bodyRadius, 7, 8);
    geo.merge(cloudBody);

    var cloudSideLeft = new THREE.SphereGeometry(bodyRadius * 0.75, 7, 8);
    cloudSideLeft.translate(-bodyRadius, 0, 0);
    geo.merge(cloudSideLeft);

    var cloudSideRight = new THREE.SphereGeometry(bodyRadius * 0.75, 7, 8);
    cloudSideRight.translate(bodyRadius, 0, 0);
    geo.merge(cloudSideRight);


    var cloudMaterial = new THREE.MeshLambertMaterial();
    cloudMaterial.color = new THREE.Color(1, 1, 1);
    cloudMaterial.transparent = true;
    cloudMaterial.opacity = 0.9;
    cloudMaterial.flatShading = true;

    //geo.com
    cloudJitter(geo, 0.2);
    geo.computeFlatVertexNormals();

    cloud = new THREE.Mesh(geo, cloudMaterial);
    cloud.castShadow = true;

    cloudsArr.push(cloud);
    clouds.add(cloud);

    //Debugging
    clouds.translateX(150);
    clouds.translateZ(50)
}

function cloudJitter(geo, magnitude) {

    geo.vertices.forEach(v => {
        v.x += map(Math.random(), 0, 1, -magnitude, magnitude);
        v.y += map(Math.random(), 0, 1, -magnitude, magnitude);
        v.z += map(Math.random(), 0, 1, -magnitude, magnitude);
    })

    function map(val, smin, smax, emin, emax) {
        return (emax - emin) * (val - emin) / (smax - smin) + emin;
    }
}


// function createCloud() {
//     var cloudMaterial = new THREE.MeshBasicMaterial();
//     cloudMaterial.color = new THREE.Color(1, 1, 1);
//     cloudMaterial.transparent = true;
//     cloudMaterial.opacity = 0.75;
//     var cloudGeometry = new THREE.BoxGeometry(20, 10, 2);
//     cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
//     cloud.castShadow = true;

//     cloudsArr.push(cloud);
//     clouds.add(cloud);
// }

// //create a cloud in the secondary group / array
// function createCloudSecondary() {
//     var cloudMaterial = new THREE.MeshBasicMaterial();
//     cloudMaterial.color = new THREE.Color(1, 1, 1);
//     cloudMaterial.transparent = true;
//     cloudMaterial.opacity = 0.75;
//     var cloudGeometry = new THREE.BoxGeometry(20, 10, 2);
//     cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
//     cloud.castShadow = true;

//     cloudsArr2.push(cloud);
//     clouds2.add(cloud);
// }

//creates as many clouds as specified in noClouds
function allocateClouds(noClouds) {
    for (let i = 0; i <= noClouds; i++) {
        createCloud();
    }
    //Randomise x and y coordinates of each cloud within a range
    cloudsArr.forEach(function(object){
        object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 80);
    });
}

// function allocateCloudsSecondary(noClouds) {
//     for (let i = 0; i <= noClouds; i++) {
//         createCloudSecondary();
//     }
//     //Randomise x and y coordinates of each cloud within a range
//     cloudsArr2.forEach(function(object){
//         object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 80);
//     });
// }

//calls the weather creation functions
function createSceneObjects() {
    //Creates the scene objects
    createLight();
    createSun();
    createMoon();
    createCloud();
    // allocateClouds(8);
    // allocateCloudsSecondary(8);

    //Adds the created objects to the scene
    scene.add(sun);
    scene.add(moon);
    scene.add(moonPointLight);
    scene.add(sunPointLight);
    scene.add(sunGlow);
    scene.add(moonGlow);

    scene.add(clouds);
    //scene.add(clouds2);
}

//Rain Particle System
var volume = 1;
var rain, rainGeo, rainDrop, rainMaterial, rainCount = 1500;

//R79
//Creates a geometry
//Pushes "rainCount" number of vertices to the geometry
//Each vertice is created at a random position within the bounds of the map
//Rain material is added to each vertices in the geometry
function generateRain() {
    rainGeo = new THREE.Geometry();
    for (let i=0; i<rainCount * volume; i++) {
        rainDrop = new THREE.Vector3 (
            Math.random() * data.width - data.width / 2,
            Math.random() * data.height * 2 - data.height * 2 / 2,
            Math.random() * 80
        );
        rainGeo.vertices.push(rainDrop);
    }
    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.5,
        transparent: true
    });
    rain = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rain);
}
