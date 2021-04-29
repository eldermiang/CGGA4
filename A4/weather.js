var rain, rainGeo, rainDrop, rainMaterial, rainCount = 1500;

function generateRain() {
    const points = [];

    for (let i=0; i<rainCount; i++) {
    rainDrop = new THREE.Vector3(
        Math.random() * 90 - 49,
        Math.random() * 90 - 49,
        Math.random() * 160
    );
    points.push(rainDrop);
    }
    //Bug - .setFromPoints() does not seem to be a function
    rainGeo = new THREE.BufferGeometry().setFromPoints(points);

    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.5,
        transparent: true
    });
    rain = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rain);
}