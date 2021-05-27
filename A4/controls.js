function buildGui() {
    gui = new dat.GUI();

    var f1 = gui.addFolder('Lighting');
    var f2 = gui.addFolder('Rain');
    var f3 = gui.addFolder('Camera');
    var f3a = f3.addFolder('Pan');
    var f4 = gui.addFolder('Terrain');
    var f5 = gui.addFolder('Skyboxes');

    var camera1 = {pos1: function(){setCamera(1)}};
    var camera2 = {pos2: function(){setCamera(2)}};
    var cameraUnlock = {unlock: function(){unlockCamera()}};
    var cameraPan = {pan: function(){ panCamera()}};
    var cameraPanOff = {panOff: function(){ disablePan()}};

    var skyBox1 = {skybox1: function() {createSkybox(skybox1)}};
    var skyBox2 = {skybox2: function() {createSkybox(skybox2)}};
    

    var params = {
        /*
        //Debugging Code
        x: sun.position.x && sunPointLight.position.x ,
        y: sun.position.y && sunPointLight.position.y ,
        z: sun.position.z && sunPointLight.position.z ,
        */

        //F1
        sun_intensity: sunPointLight.intensity ,
        moon_intensity: moonPointLight.intensity,
        speed: speed,
        distance: distance,
        //F2
        rain_enabled: rain_enabled,
        particle_size: size,
        rain_speed: dropSpeed,
        rain_volume: volume,
        //F4
        terrain_octaves: octaves,
        terrain_frequency: frequency,
        terrain_elevation: elevation,
        terrain_amplitude: amplitude,
        terrain_peakHeight: peakHeight,
        terrain_size: terrainSize
    }

    /*
    //Debugging Code
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
    */

    //F1 Lighting
    //Intensity of the sun point light
    f1.add(params, 'sun_intensity', 0, 1).onChange(function(val){
        sunPointLight.intensity = val;
    });
    //Intensity of the moon point light
    f1.add(params, 'moon_intensity', 0, 1).onChange(function(val){
        moonPointLight.intensity = val;
    });
    //Speed of orbit cycle
    f1.add(params, 'speed', 0, 1).onChange(function(val){
        speed = val;
    });
    //Vertical distance of each body to the plane
    f1.add(params, 'distance', 25, 300).onChange(function(val){
        distance = val;
    });

    //F2 Rain
    //Toggles rain off / on
    f2.add(params, 'rain_enabled').name("Toggle Rain").onChange(function(val){
        rain_enabled = val;
    });
    //Size of each particle (vertices)
    f2.add(params, 'particle_size', 0.1, 2).onChange(function(val){
        size = val;
    });
    //Speed that each particle falls at
    f2.add(params, 'rain_speed', 0.05, 1).onChange(function(val){
        dropSpeed = val;
    });
    //Total volume of rain (Uses base rainCount: 1500)
    f2.add(params, 'rain_volume', 0, 10).onChange(function(val){
        volume = val;
    });

    //F3 Camera
    f3.add(camera1, 'pos1').name("Camera 1");
    f3.add(camera2, 'pos2').name("Camera 2");
    f3.add(cameraUnlock, 'unlock').name("Unlock Camera");

    f3a.add(cameraPan, 'pan').name("On");
    f3a.add(cameraPanOff, 'panOff').name("Off");

    //F4 Terrain
    f4.add(params, 'terrain_octaves', 1, 16).onChange(function(val){
        octaves = val;
    });

    f4.add(params, 'terrain_frequency', 1, 8).onChange(function(val){
        frequency = val;
    });

    f4.add(params, 'terrain_elevation', -0.5, 1).onChange(function(val){
        elevation = val;
    });

    f4.add(params, 'terrain_amplitude', 1, 2.5).onChange(function(val){
        amplitude = val;
    });

    f4.add(params, 'terrain_peakHeight', 1, 4).onChange(function(val){
        peakHeight = val;
    });

    f4.add(params, 'terrain_size', 50, 300).onChange(function(val){
        terrainSize = val;
    });

    f5.add(skyBox1, 'skybox1').name("Space");
    f5.add(skyBox2, 'skybox2').name("Cloudy");
}