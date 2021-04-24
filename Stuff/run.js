setScene();
addLight();
createFloor();
addShapes();
loadModel('Models/BuildingBasic.obj');
document.addEventListener('mousedown', onDocumentMouseDown, false);
animate();
window.addEventListener('resize', resizeScene);