function animate() {
    animateCloudMovement();
    animateCelestialMovement();
    animateRain();
    updateTerrain();
    panCamera();
    renderer.render(scene, camera);
    controls.update();
    sunGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, sunGlow.position);
    moonGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, moonGlow.position);
    requestAnimationFrame(animate);
}

var tempOctaves = octaves;
var tempFrequency = frequency;
var tempElevation = elevation;
var tempAmplitude = amplitude;
var tempPeakHeight = peakHeight;
var tempTerrainSize = terrainSize;
var tempUndergroundDepth = undergroundDepth;

function updateTerrain() {
    if ((tempOctaves != octaves) || (tempFrequency != frequency) || (tempElevation != elevation) 
        || (tempAmplitude != amplitude) || (tempPeakHeight != peakHeight) || (tempTerrainSize != terrainSize)
        || (tempUndergroundDepth != undergroundDepth)) {
        
        //Dispose of Terrain from memory
        scene.remove(terrain1);
        removeBuildings();

        tGeo.dispose();
        terrain1.geometry.dispose();
        terrain1.material.dispose()

        //Dispose of underground from memory
        scene.remove(underground);
        underground.geometry.dispose();
        underground.material.dispose()

        //Update/Recreate noise image and terrain object
        data = generateTexture();
        terrain1 = createTerrain();
        underground = createUnderground(theme1);
        calculateColour(theme1);

        //Updating terrain variables with slider values
        tempOctaves = octaves;
        tempFrequency = frequency;
        tempElevation = elevation;
        tempAmplitude = amplitude;
        tempPeakHeight = peakHeight;
        tempTerrainSize = terrainSize;
        tempUndergroundDepth = undergroundDepth;

        scene.add(terrain1);
        scene.add(underground);
        findFacePosition();
        addObjects();
    }
}

function setCamera(pos) {
    switch (pos){
        case 1:
            camera.position.set(0, -75, 30);
            camera.fov = 60;
            controls.minDistance = 50; //controls min distance of the camera zoom
            controls.maxDistance = 150; //controls max distance of the camera zoom
            controls.minPolarAngle = 0;
            controls.maxPolarAngle = Math.PI/1.2;
            controls.minAzimuthAngle = 0;
            controls.maxAzimuthAngle = 0;
            break;
        case 2:
            camera.position.set(0, -90, 15);
            camera.fov = 10;
            camera.lookAt(new THREE.Vector3(0,50,200));
            controls.minDistance = 90;
            controls.maxDistance = 105;
            controls.minPolarAngle = Math.PI/1.07;
            controls.maxPolarAngle = Math.PI/1.07;
            controls.minAzimuthAngle = 0;
            controls.maxAzimuthAngle = 0;
            break;
        default:
            renderer.render(0, -75, 30);
    }
}

var panOn = false;
function panCamera() {
    if (panOn) {
        scene.rotation.z += 0.005;
    }
}

function unlockCamera() {
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.minPolarAngle = -Math.PI;
    controls.maxPolarAngle = Math.PI;
    controls.minAzimuthAngle = -Math.PI;
    controls.maxAzimuthAngle = Math.PI;
}

//Sun and Moon Orbit / Movement
//Circular loop
//Cosine for horizontal movement (x-axis)
//Sine for vertical movement (z-axis)
var d = 0;
var starSpeed = 0.1;
var distance = 300;
function animateCelestialMovement() {
    d += 0.01 * starSpeed;
    sunPosition.x = data.width * Math.cos(d);
    sunPosition.z = -distance * Math.sin(d);

    moonPosition.x = -data.width * Math.cos(d);
    moonPosition.z = distance * Math.sin(d);

    //Sun/Moon position
    sun.position.x = sunPosition.x;
    sun.position.z = sunPosition.z;

    moon.position.x = moonPosition.x;
    moon.position.z = moonPosition.z;

    //Sun/Moon Pointlight position
    sunPointLight.position.x = sunPosition.x;
    sunPointLight.position.z = sunPosition.z;

    moonPointLight.position.x = moonPosition.x;
    moonPointLight.position.z = moonPosition.z;

    //Sun/Moon Glow position
    sunGlow.position.x = sunPosition.x;
    sunGlow.position.z = sunPosition.z;

    moonGlow.position.x = moonPosition.x;
    moonGlow.position.z = moonPosition.z;
}

//Cloud movement
//Cloud x positions reset to starting point after exceeding end point
//Cloud y positions randomised at the start of every x reset
var cloudSpeed = 0.1;
var cloudScale = 1;
clouds.position.x = -data.width;
function animateCloudMovement() {
    updateCloudNo();

    clouds.children.forEach(cloud => {
        cloud.scale.set(cloudScale, cloudScale, cloudScale);
        cloud.position.x += cloudSpeed;

        if (cloud.position.x > Math.abs(clouds.position.x) + data.width * 0.75) {
            cloud.position.x = Math.abs(clouds.position.x) + -data.width * 0.75;
            cloud.position.y = Math.random() * ((data.width/2) - (-data.width/2) + 1) + (-data.width/2);
        }
    });
}

//Listener for changes to cloudNo
//Updates cloud number
var tempCloudNo = cloudNo;
function updateCloudNo() {
    if (tempCloudNo != cloudNo) {
        clouds.remove(...clouds.children);
        allocateClouds(cloudNo);
    }
    tempCloudNo = cloudNo;
}

//Animates rainfall
//Position of each vertice resets to 80 after dropping below 0
var size = 0.3;
var dropSpeed = 0.5;
var rain_enabled = false;
function animateRain() {
    updateRainVolume();
    if (rain_enabled) {
        if (!rain.visible) {
            rain.visible = true;
        }
    }
    else {
        if (rain.visible) {
            rain.visible = false;
        }
    }

    rainMaterial.size = size;
    rainGeo.vertices.forEach(p => {
        p.z -= dropSpeed;
        if (p.z < 0) {
            p.z = 80;
        }
    })
    rainGeo.verticesNeedUpdate = true;
}

//Listener for changes to volume
//Updates rain volume
var tempVolume = volume;
function updateRainVolume() {
    if (tempVolume != volume) {
        //Dispose of rain objects from memory
        scene.remove(rain);
        rainGeo.dispose();
        rain.geometry.dispose();
        rain.material.dispose();
        //Recreate rain objects
        generateRain();
        //Update temp volume
        tempVolume = volume;
    }
}
