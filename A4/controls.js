function buildGui() {
    gui = new dat.GUI();

    var f1 = gui.addFolder('Lighting');
    var f2 = gui.addFolder('Rain');
    var f3 = gui.addFolder('Camera');

    var camera1 = {pos1: function(){setCamera(1)}};
    var camera2 = {pos2: function(){setCamera(2)}};

    // var disableRain  = {disableRain: function(){
    //     rain_enabled
    // }};
        
    var params = {
        // x: sun.position.x && sunPointLight.position.x ,
        // y: sun.position.y && sunPointLight.position.y ,
        // z: sun.position.z && sunPointLight.position.z ,
        sun_intensity: sunPointLight.intensity ,
        moon_intensity: moonPointLight.intensity,
        speed: speed,
        distance: distance,
        rain_enabled: rain_enabled,
        particle_size: size,
        rain_speed: dropSpeed,
        rain_volume: volume
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

    f2.add(params, 'rain_enabled').name("Toggle Rain").onChange(function(val){
        rain_enabled = val;
    });

    // f2.add(disableRain, 'disableRain').name("Disable Rain");
    // f2.add(enableRain, 'enableRain').name("Enable Rain");

    f2.add(params, 'particle_size', 0.1, 2).onChange(function(val){
        size = val;
    });

    f2.add(params, 'rain_speed', 0.05, 1).onChange(function(val){
        dropSpeed = val;
    });

    f2.add(params, 'rain_volume', 0, 10).onChange(function(val){
        volume = val;
    });

    f3.add(camera1, 'pos1').name("Camera 1");
    f3.add(camera2, 'pos2').name("Camera 2");
}