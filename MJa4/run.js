//Setting up Scene

setScene();
createSceneObjects();
generateRain();
addObjects();
animate();
buildGui();

//Debugging

// console.log(sun.position);
// console.log(boxes);
// console.log(sun);
// console.log(cloud);
console.log(rainGeo);
console.log(THREE.REVISION);

window.addEventListener('resize', resize);