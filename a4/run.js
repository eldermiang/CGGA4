//Setting up Scene

setScene();
createSceneObjects();
addObjects();
animate();
buildGui();

//Debugging

// console.log(hemiLight.intensity);
// console.log(hemiLight.groundColor);
// console.log(hemiLight.position);
console.log(sun.position);
//console.log(dirLight.position);
console.log(boxes);
// console.log(plane.position);
console.log(sun);
console.log(cloud);

window.addEventListener('resize', resize);