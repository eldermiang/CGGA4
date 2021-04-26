function buildGui() {
    gui = new dat.GUI();

    var params = {
        x: sun.position.x && sunPointLight.position.x ,
        y: sun.position.y && sunPointLight.position.y ,
        z: sun.position.z && sunPointLight.position.z ,
        sun_intensity: sunPointLight.intensity ,
        moon_intensity: moonPointLight.intensity,
        speed: speed,
        particle_size: size,
        rain_speed: dropSpeed,
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

    gui.add(params, 'sun_intensity', 0, 1).onChange(function(val){
        sunPointLight.intensity = val;
        //alpha = val;
    });

    gui.add(params, 'moon_intensity', 0, 1).onChange(function(val){
        moonPointLight.intensity = val;
        //alpha = val;
    });

    gui.add(params, 'speed', 0, 1).onChange(function(val){
        speed = val;
    });

    gui.add(params, 'distance', 25, 250).onChange(function(val){
        distance = val;
    });

    gui.add(params, 'particle_size', 0.1, 2).onChange(function(val){
        size = val;
    });

    gui.add(params, 'rain_speed', 0.05, 0.5).onChange(function(val){
        dropSpeed = val;
    });
}