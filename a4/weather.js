// var particleCount = 1000,
// particles = new THREE.BufferGeometry(),
// particleSystem,
// pMaterial = new THREE.PointsMaterial({
//     color: 0xFFFFFF,
//     size: 20
// });


// function createParticleSystem() {
//     for (var p = 0; p < particleCount; p++) {
//         var pX = Math.random() * 500 - 250,
//         pY = Math.random() * 500 - 250,
//         pZ = Math.random() * 500 - 250,
//         particle = new THREE.Vector3(pX, pY, pZ);
//     }

//     var verticesArray = [];
//     verticesArray.push(particle);

//     //particles.vertices.push(particle);
//     particles.setAttribute('vertices', new THREE.BufferAttribute(new Float32Array(verticesArray), 3));

//     particleSystem = new THREE.Points(particles, pMaterial);
//     console.log(particleSystem);
// }

// const rand = (min, max) => min + Math.random() * (max-min);
// let particles;
// const MAX = 100;

// function createParticles() {
//     particles = [];
//     const geo = new THREE.
// }

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
    rainGeo = new THREE.BufferGeometry().setFromPoints(points);

    rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.5,
        transparent: true
    });
    rain = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rain);
}