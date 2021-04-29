setScene();
//generateRain();
createSceneObjects();
//Lighting looks very strange with addObjects function
//addObjects();
animate();
buildGui();

findFacePosition();
addModels();

//putting addModels() anywhere in run.js fucks up the code in some way - David

calculateColour();

window.addEventListener('resize', resizeScene);