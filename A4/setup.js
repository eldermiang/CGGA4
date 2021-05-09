var scene;
var camera;
var renderer;
var controls;

//Setup the 3 main components: scene, camera, renderer
function setScene() {
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(55, ratio, 20, 30000); //changed values
    camera.position.set(0, -75, 30);
    //camera.lookAt(100, 100, 100);

    renderer = new THREE.WebGLRenderer({antialias:true}); //added antialias
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera); //remove , .domElement
    controls.minDistance = 50; //controls the mindistance of orbit control
    controls.maxDistance = 105; //controls the maxdistance of orbit controls
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

