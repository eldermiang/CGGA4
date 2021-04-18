setScene();
addLight();
createFloor();
addShapes();
loadModel('Models/EmpireSquare');
document.addEventListener('mousedown', onDocumentMouseDown, false);
animate();
window.addEventListener('resize', resizeScene);