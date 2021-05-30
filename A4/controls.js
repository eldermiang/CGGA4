function buildGui() {
    gui = new dat.GUI();

    var f1 = gui.addFolder('Lighting');

    var f2 = gui.addFolder('Weather');
    var f2a = f2.addFolder('Rain');
    var f2b = f2.addFolder('Clouds');

    var f3 = gui.addFolder('Camera');
    var f3a = f3.addFolder('Pan');

    var f4 = gui.addFolder('Terrain');

    var f5 = gui.addFolder('Skyboxes');

    var camera1 = {pos1: function(){setCamera(1)}};
    var camera2 = {pos2: function(){setCamera(2)}};
    var cameraUnlock = {unlock: function(){unlockCamera()}};
    var cameraPan = {pan: function(){ panCamera()}};
    var cameraPanOff = {panOff: function(){ disablePan()}};

    var skyBox1 = {skybox1: function() {changeSkybox(skybox1)}};
    var skyBox2 = {skybox2: function() {changeSkybox(skybox2)}};
    var skyBox3 = {skybox3: function() {changeSkybox(skybox3)}};
    var skyBox4 = {skybox4: function() {changeSkybox(skybox4)}};

    

    var params = {
        //F1 Lighting
        sun_intensity: sunPointLight.intensity ,
        moon_intensity: moonPointLight.intensity,
        speed: starSpeed,
        distance: distance,
        //F2 Weather
        //F2a Rain
        rain_enabled: rain_enabled,
        particle_size: size,
        rain_speed: dropSpeed,
        rain_volume: volume,
        //F2b Clouds
        cloud_speed: cloudSpeed,
        cloud_scale: cloudScale,
        cloud_no: cloudNo,
        //F4 Terrain
        terrain_octaves: octaves,
        terrain_frequency: frequency,
        terrain_elevation: elevation,
        terrain_amplitude: amplitude,
        terrain_peakHeight: peakHeight,
        terrain_size: terrainSize,
        underground_depth: undergroundDepth
    }

    //F1 Lighting
    //Intensity of the sun point light
    f1.add(params, 'sun_intensity', 0, 1).onChange(function(val){
        sunPointLight.intensity = val;
        sunGlow.material.uniforms.c.value = val * 0.6;
    });
    //Intensity of the moon point light
    f1.add(params, 'moon_intensity', 0, 1).onChange(function(val){
        moonPointLight.intensity = val;
        moonGlow.material.uniforms.c.value = val * 0.6;
    });
    //Speed of orbit cycle
    f1.add(params, 'speed', 0, 1).onChange(function(val){
        starSpeed = val;
    });
    //Vertical distance of each body to the plane
    f1.add(params, 'distance', 25, 300).onChange(function(val){
        distance = val;
    });

    //F2 Weather
    //F2a Rain
    //Toggles rain off / on
    f2a.add(params, 'rain_enabled').name("Toggle Rain").onChange(function(val){
        rain_enabled = val;
    });
    //Size of each particle (vertices)
    f2a.add(params, 'particle_size', 0.1, 2).onChange(function(val){
        size = val;
    });
    //Speed that each particle falls at
    f2a.add(params, 'rain_speed', 0.05, 1).onChange(function(val){
        dropSpeed = val;
    });
    //Total volume of rain (Uses base rainCount: 1500)
    f2a.add(params, 'rain_volume', 0, 10).onChange(function(val){
        volume = val;
    });
    //F2b Clouds
    //Set speed of cloud movement
    f2b.add(params, 'cloud_speed', 0, 1).onChange(function(val){
        cloudSpeed = val;
    });
    f2b.add(params, 'cloud_scale', 0.1, 3).onChange(function(val){
        cloudScale = val;
    });
    f2b.add(params, 'cloud_no', 0, 20).step(1).onChange(function(val){
        cloudNo = val;
    });
    //F3 Camera
    //F3
    f3.add(camera1, 'pos1').name("Camera 1");
    f3.add(camera2, 'pos2').name("Camera 2");
    f3.add(cameraUnlock, 'unlock').name("Unlock Camera");
    //F3a Pan
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
    f4.add(params, 'underground_depth', 10, 50).onChange(function(val){
        undergroundDepth = val;
    });

    //F5 Skybox
    f5.add(skyBox1, 'skybox1').name("Space");
    f5.add(skyBox2, 'skybox2').name("Cloudy");
    f5.add(skyBox3, 'skybox3').name("Winter");
    f5.add(skyBox4, 'skybox4').name("Cityscape");
}