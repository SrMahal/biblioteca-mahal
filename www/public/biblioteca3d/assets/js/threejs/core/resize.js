export function setupResize({
    renderer,
    camera,
    scene
}) {
    window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        const isMobile = width < 768;

        renderer.setPixelRatio(
            isMobile
                ? 1
                : Math.min(window.devicePixelRatio, 2)
        );

        renderer.render(scene, camera);
    });
}