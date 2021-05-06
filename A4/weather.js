var rain, rainGeo, rainDrop, rainMaterial, rainCount = 1500;
rainGeo = new THREE.Geometry();
/*
//R127

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
*/

//R79

function generateRain() {
    for (let i=0; i<rainCount; i++) {
        rainDrop = new THREE.Vector3 (
            Math.random() * data.width - data.width / 2,
            Math.random() * data.height - data.height / 2,
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
    console.log(rainGeo);
    scene.add(rain);
}