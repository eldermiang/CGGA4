var plane = null;
var box = null;
var sun = null;

var ambientLight;
var hemiLight;
var dirLight;

function createPlane() {
    var planeMaterial = new THREE.MeshLambertMaterial();
    planeMaterial.color = new THREE.Color(0.7, 0.7, 0.7);
    //planeMaterial.color = new THREE.Color(0xf9d71c);
    planeMaterial.side = THREE.DoubleSide;

    var planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
}

function createBox() {
    var boxMaterial = new THREE.MeshBasicMaterial();
    boxMaterial.color = new THREE.Color(0.5, 0.5 , 0.5);

    var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 0, 0.5);
}

function createLight() {
    //ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.5);
    hemiLight = new THREE.HemisphereLight(new THREE.Color(1, 1, 1), 1);
    //hemiLight.groundColor = new THREE.Color(1, 1, 1);
    hemiLight.skyColor = new THREE.Color(1, 1, 1);
    hemiLight.position.set(0, 100, 0);
    //hemiLight.groundColor = new THREE.Color(0, 0, 0);
}

function createSun() {
    var sunPosition = new THREE.Vector3(-20, 1, 1);

    var sunMaterial = new THREE.MeshPhongMaterial();
    sunMaterial.color = new THREE.Color(0xf9d71c);

    var sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);


    dirLight = new THREE.DirectionalLight(new THREE.Color(0xf9d71c), 1);
    dirLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    dirLight.castShadow = true;
}

function addObjects() {
    scene.add(plane);
    scene.add(box);
    scene.add(sun);
    scene.add(camera);
    scene.add(hemiLight);
    scene.add(dirLight);
    //scene.add(ambientLight);
}