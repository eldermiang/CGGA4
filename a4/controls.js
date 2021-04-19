function buildGui() {
    gui = new dat.GUI();

    var params = {
        x: sun.position.x && pointLight.position.x ,
        y: sun.position.y && pointLight.position.y ,
        z: sun.position.z && pointLight.position.z
    }

    gui.add(params, 'x', -50, 50).onChange(function(val){
        sun.position.x = val;
        pointLight.position.x = val;
    });

    gui.add(params, 'y', -50, 50).onChange(function(val){
        sun.position.y = val;
        pointLight.position.y = val;
    });

    gui.add(params, 'z', 5, 100).onChange(function(val){
        sun.position.z = val;
        pointLight.position.z = val;
    });
}