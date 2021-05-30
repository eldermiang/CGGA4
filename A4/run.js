setScene();
createSceneObjects();
createSkybox(skybox1);
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

calculateColour(theme1);

window.addEventListener('resize', resizeScene);