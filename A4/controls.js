function buildGui() {
    gui = new dat.GUI();

    var f1 = gui.addFolder('Lighting');
    var f2 = gui.addFolder('Rain');

    var params = {
        // x: sun.position.x && sunPointLight.position.x ,
        // y: sun.position.y && sunPointLight.position.y ,
        // z: sun.position.z && sunPointLight.position.z ,
        sun_intensity: sunPointLight.intensity ,
        moon_intensity: moonPointLight.intensity,
        speed: speed,
        particle_size: size,
        rain_speed: dropSpeed,
        rain_volume: volume,
        distance: distance
    }

    // gui.add(params, 'x', -50, 50).onChange(function(val){
    //     sun.position.x = val;
    //     pointLight.position.x = val;
    // });

    // gui.add(params, 'y', -50, 50).onChange(function(val){
    //     sun.position.y = val;
    //     pointLight.position.y = val;
    // });

    // gui.add(params, 'z', 5, 100).onChange(function(val){
    //     sun.position.z = val;
    //     pointLight.position.z = val;
    // });

    f1.add(params, 'sun_intensity', 0, 1).onChange(function(val){
        sunPointLight.intensity = val;
        //alpha = val;
    });

    f1.add(params, 'moon_intensity', 0, 1).onChange(function(val){
        moonPointLight.intensity = val;
        //alpha = val;
    });

    f1.add(params, 'speed', 0, 1).onChange(function(val){
        speed = val;
    });

    f1.add(params, 'distance', 25, 250).onChange(function(val){
        distance = val;
    });

    f2.add(params, 'particle_size', 0.1, 2).onChange(function(val){
        size = val;
    });

    f2.add(params, 'rain_speed', 0.05, 1).onChange(function(val){
        dropSpeed = val;
    });

    f2.add(params, 'rain_volume', 0, 10).onChange(function(val){
        volume = val;
    });
}