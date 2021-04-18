var scene;
var camera;
var renderer;
let simplex = new SimplexNoise(4);

function setScene() {
    scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 5);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function resizeWindow() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
};

function map(val, smin, smax, emin, emax) {
    const t =  (val-smin)/(smax-smin);
    return (emax-emin)*t + emin;
}
function noise(nx, ny) {
    // Re-map from -1.0:+1.0 to 0.0:1.0
    return map(simplex.noise2D(nx,ny),-1,1,0,1);
}
//stack some noisefields together
function octave(nx,ny,octaves) {
    let val = 0;
    let freq = 1;
    let max = 0;
    let amp = 1;
    for(let i=0; i<octaves; i++) {
        val += noise(nx*freq,ny*freq)*amp;
        max += amp;
        amp /= 2;
        freq  *= 2;
    }
    return val/max;
}

function generateTexture() {
    const canvas = document.getElementById('debug-canvas');
    const c = canvas.getContext('2d');

    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height);

    for(let i=0; i<canvas.width; i++) {
        for(let j=0; j<canvas.height; j++) {
            let v =  octave(i/canvas.width,j/canvas.height,16);
            const per = (100*v).toFixed(2)+'%';
            c.fillStyle = `rgb(${per},${per},${per})`;
            c.fillRect(i,j,1,1);
        }
    }
    return c.getImageData(0,0,canvas.width,canvas.height);
}

function createTerrain() {
  

    const geo = new THREE.PlaneGeometry(data.width,data.height,
        data.width,data.height+1)
//assign vert data from the canvas
for(let j=0; j<data.height; j++) {
for (let i = 0; i < data.width; i++) {
const n =  (j*(data.height)  +i)
const nn = (j*(data.height+1)+i)
const col = data.data[n*4] // the red channel
const v1 = geo.vertices[nn]
v1.z = map(col,0,255,-10,10) //map from 0:255 to -10:10
if(v1.z > 2.5) v1.z *= 1.3 //exaggerate the peaks
// v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
// v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
}
}
}