function animate() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
}