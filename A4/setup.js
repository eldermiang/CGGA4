var scene;
var camera = null;
var renderer;
var controls;

//Setup the 3 main components: scene, camera, renderer
function setScene() {
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, ratio, 20, 30000);
    camera.position.set(0, -75, 30);
    //camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 50; //controls min distance of the camera zoom
    // controls.maxDistance = 150; //controls max distance of the camera zoom
    // controls.minPolarAngle = 0;
    // controls.maxPolarAngle = Math.PI/1.2;
    // controls.minAzimuthAngle = 0;
    // controls.maxAzimuthAngle = 0;

    //need to fix camera still able to zoom past min and max
}

//Resize the scene and update the camera aspect to the screen ration
var resizeScene = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
};

