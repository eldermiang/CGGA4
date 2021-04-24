function animate() {
    animateSunColor();
    //animateSunMovement();
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
function animateSunMovement() {
    d += 0.01 * speed;
    sunPosition.x = 150 * Math.cos(d);
    sunPosition.z = -100 * Math.sin(d);

    sun.position.x = sunPosition.x;
    sun.position.z = sunPosition.z;

    pointLight.position.x = sunPosition.x;
    pointLight.position.z = sunPosition.z;
}