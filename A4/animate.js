
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
            break;
        case 2:
            camera.position.set(0, -75, 0);
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

//.clear() doesn't seem to be a function for some reason - Michael

clouds.position.x = -100;
function animateCloudMovement() {
    clouds.position.x += 0.1
    if (clouds.position.x > 100) {
        //clouds.clear();
        clouds.remove(...clouds.children);
        allocateClouds(8);
        clouds.position.x = -100;
    }
}

var size = 0.3;
var dropSpeed = 0.5;
var rain_enabled = true;

/*
//R127

function animateRain() {
    rainMaterial.size = size;

    rainGeo.attributes.position.needsUpdate = true;
    rain.position.z -= dropSpeed;
    if (rain.position.z < -80) {
        rain.position.z = 0;
    }
}
*/

function animateRain() {
    if (rain_enabled) {
        //rain.visible = true;
        // rain.traverse(function(child){
        //     child.visible = true;
        // });
        if (!rain.visible) {
            //rain.visible = true;
            rain.opacity = 1;
        }
    }
    else {
        //rain.visible = false;
        // rain.traverse(function(child){
        //     child.visible = false;
        // });
        if (rain.visible) {
            rain.opacity = 0;
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