var volume = 1;
var rain, rainGeo, rainDrop, rainMaterial, rainCount = 1500;

//R79
function generateRain() {
    rainGeo = new THREE.Geometry();
    for (let i=0; i<rainCount * volume; i++) {
        rainDrop = new THREE.Vector3 (
            Math.random() * data.width - data.width / 2,
            Math.random() * data.height * 2 - data.height * 2 / 2,
            Math.random() * 80
        );
        rainGeo.vertices.push(rainDrop);
    }
    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.5,
        transparent: true
    });
    rain = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rain);
}
