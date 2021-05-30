setScene();
createSceneObjects();
createSkybox(skybox1);
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

calculateColour();

window.addEventListener('resize', resizeScene);