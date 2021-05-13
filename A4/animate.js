function animate() {
    animateCloudMovement();
    animateCelestialMovement();
    animateRain();
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
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
            break;
        case 2:
            camera.position.set(0, -90, 15);
            camera.fov = 10;
            camera.lookAt(new THREE.Vector3(0,50,200));
            controls.minDistance = 90;
            controls.maxDistance = 105;
            controls.minPolarAngle = Math.PI/1.07;
            controls.maxPolarAngle = Math.PI/1.07;
            break;
        default:
            renderer.render(0, -75, 30);
    }
}

var alpha = 1;
function animateSunColor() {
    var dayColor = new THREE.Color(0xf9d71c);
    var nightColor = new THREE.Color(0xeaf4fc);

    var sunColor = new THREE.Color(0xeaf4fc);
    sunColor.lerpColors(nightColor, dayColor, alpha);
    sun.material.color = sunColor;
    //sun.material.color = new THREE.Color(0xeaf4fc);
}

var d = 0;
var speed = 0.1;
var distance = 100;
function animateCelestialMovement() {
    d += 0.01 * speed;
    sunPosition.x = 150 * Math.cos(d);
    sunPosition.z = -distance * Math.sin(d);

    sun.position.x = sunPosition.x;
    sun.position.z = sunPosition.z;

    sunPointLight.position.x = sunPosition.x;
    sunPointLight.position.z = sunPosition.z;

    moonPosition.x = -150 * Math.cos(d);
    moonPosition.z = distance * Math.sin(d);

    moon.position.x = moonPosition.x;
    moon.position.z = moonPosition.z;

    moonPointLight.position.x = moonPosition.x;
    moonPointLight.position.z = moonPosition.z;
}

clouds.position.x = -100;
function animateCloudMovement() {
    clouds.position.x += 0.1
    if (clouds.position.x > 100) {
        clouds.remove(...clouds.children);
        allocateClouds(8);
        clouds.position.x = -100;
    }
}

var size = 0.3;
var dropSpeed = 0.5;
var rain_enabled = true;

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
        //p.x += dropSpeed;
        if (p.z < 0) {
            p.z = 80;
        }
    })
    rainGeo.verticesNeedUpdate = true;
}

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
