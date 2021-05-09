setScene();
window.addEventListener('resize', resizeScene);
//generateRain();
createSceneObjects();
createSkybox();
//Lighting looks very strange with addObjects function
//addObjects();
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

//putting addModels() anywhere in run.js fucks up the code in some way - David

calculateColour();

