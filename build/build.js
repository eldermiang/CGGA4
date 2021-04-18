let simplex = new SimplexNoise(4);

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
    const canvas = document.createElement('canvas');
    //const c = canvas.getContext('2d');
    const c = canvas.getContext('2d', {
        preserveDrawingBuffer: true
      });

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


