var plane = null;

var ambientLight;

function createPlane() {
    var planeMaterial = new THREE.MeshLambertMaterial();
    planeMaterial.color = new THREE.Color(0.7, 0.7, 0.7);
    planeMaterial.side = THREE.DoubleSide;

    var planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
}

function createLight() {
    ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.5);
}

function addObjects() {
    scene.add(plane);
    scene.add(camera);
    scene.add(ambientLight);
}