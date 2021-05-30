setScene();
createSceneObjects();
createSkybox(skybox1);
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

calculateColour(theme1);
console.log(clouds);

window.addEventListener('resize', resizeScene);