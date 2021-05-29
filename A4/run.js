setScene();
createSceneObjects();
createSkybox(skybox1);
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

calculateColour();
console.log(clouds.position);
console.log(data.width);

window.addEventListener('resize', resizeScene);