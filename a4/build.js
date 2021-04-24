var plane = null, box = null, cloud = null, boxes = [], cloudsArr = [];
var sun = null, sunPosition;
var clouds = new THREE.Object3D();
var ambientLight, hemiLight, dirLight, pointLight;
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
    //ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.5);
    hemiLight = new THREE.HemisphereLight(new THREE.Color(0.6, 0.6, 0.6), 0.2);
    //hemiLight.groundColor = new THREE.Color(1, 1, 1);
    hemiLight.skyColor = new THREE.Color(1, 1, 1);
    hemiLight.position.set(0, 0, 100);
    //hemiLight.groundColor = new THREE.Color(0, 0, 0);
}

function createSun() {
    sunPosition = new THREE.Vector3(-5, 3, 100);
    var sunMaterial = new THREE.MeshBasicMaterial();
    sunMaterial.color = new THREE.Color(0xf9d71c);

    var sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);

    pointLight = new THREE.PointLight(new THREE.Color(0xf9d71c), 1, 1000, 0);
    pointLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.mapSize.radius = 2;

    pointLight.intensity = 1;

    // dirLight = new THREE.DirectionalLight(new THREE.Color(0xf9d71c), 1);
    // dirLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    // dirLight.castShadow = true;

    // dirLight.shadow.mapSize.width = 1024;
    // dirLight.shadow.mapSize.height = 1024;
    // dirLight.shadow.radius = 2;
}

function createCloud() {
    var cloudMaterial = new THREE.MeshBasicMaterial();
    cloudMaterial.color = new THREE.Color(1, 1, 1);
    cloudMaterial.transparent = true;
    cloudMaterial.opacity = 0.75;
    var cloudGeometry = new THREE.BoxGeometry(20, 10, 2);
    cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

    cloudsArr.push(cloud);
    clouds.add(cloud);
}

function allocateClouds(noClouds) {
    for (let i = 0; i <= noClouds; i++) {
        createCloud();
    }
    cloudsArr.forEach(function(object){
        object.position.set(Math.random() * (max - min + 1) + min, Math.random() * (max - min + 1) + min , 60)
    });
}

function createSceneObjects() {
    createPlane();
    createLight();
    createSun();
    //createCloud();
    allocateBoxes(30);
    allocateClouds(8);
}

function addObjects() {
    scene.add(plane);
    scene.add(sun);
    scene.add(hemiLight);
    scene.add(pointLight);
    scene.add(clouds);
    // scene.add(particleSystem);
    // scene.add(dirLight);
    // scene.add(ambientLight);
}