setScene();
createLight();
createSun();

createPlane();
createBox();

addObjects();

animate();

// console.log(hemiLight.intensity);
// console.log(hemiLight.groundColor);
// console.log(hemiLight.position);
console.log(sun.position);
console.log(dirLight.position);
// console.log(plane.position);

window.addEventListener('resize', resize);