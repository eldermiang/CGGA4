var scene;
var camera;
var renderer;
var controls

function setScene() {
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x87ceeb);

    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(0, -50, 100);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

var resize = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}
