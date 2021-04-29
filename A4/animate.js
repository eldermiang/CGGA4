
function animate() {
    //animateCloudMovement();
    animateCelestialMovement();
    //animateRain();
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
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
var speed = 0.5;
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

//.clear() doesn't seem to be a function for some reason - Michael

clouds.position.x = -100;
function animateCloudMovement() {
    clouds.position.x += 0.1
    if (clouds.position.x > 100) {
        clouds.clear();
        allocateClouds(8);
        clouds.position.x = -100;
    }
}

var size = 0.5;
var dropSpeed = 0.1;
function animateRain() {
    rainMaterial.size = size;

    rainGeo.attributes.position.needsUpdate = true;
    rain.position.z -= dropSpeed;
    if (rain.position.z < -80) {
        rain.position.z = 0;
    }
}