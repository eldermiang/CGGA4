/* global THREE, cube, scene, camera, renderer */

function animate() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
}

//Define a raycaster from THREE to apply for intersected objects
var raycaster = new THREE.Raycaster();
//Define a selected object
var selectedObject = false;

//add event listener to the model and move the model with mouse-down position
function onDocumentMouseDown(event) {
    var mouse = new THREE.Vector2;
    mouse.x = (event.clientX/renderer.domElement.clientWidth)*2-1;
    mouse.y = -(event.clientY/renderer.domElement.clientHeight)*2+1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
        if ((intersects[0].object.name === "loaded_mesh" ) && !selectedObject){
            intersects[0].object.material.color = new THREE.Color(1, 1.5, 155);
            selectedObject = true;
        }
        if ((intersects[0].object.name !== "loaded_mesh") && selectedObject){
            mesh.material.color = new THREE.Color(0.6, 0.2, 0.4);
            var pos = intersects[0].point;
            mesh.position.x = pos.x;
            mesh.position.y = pos.y;
            selectedObject = false;
        }
    }
}