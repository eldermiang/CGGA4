setScene();
createSceneObjects();
createSkybox(skybox1);
generateRain();
animate();
buildGui();

findFacePosition();
addModels();

//putting addModels() anywhere in run.js fucks up the code in some way - David
console.log(rain);

calculateColour();

console.log(sunGlow);
console.log(moonGlow);

window.addEventListener('resize', resizeScene);