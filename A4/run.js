setScene();
createSceneObjects();
createSkybox(skybox1);
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

calculateColour(theme);

window.addEventListener('resize', resizeScene);