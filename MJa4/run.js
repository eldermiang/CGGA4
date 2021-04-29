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

window.addEventListener('resize', resize);