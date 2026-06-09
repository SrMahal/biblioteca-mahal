import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function startAnimationLoop({
    renderer,
    scene,
    camera,
    update = null
}) {

    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const deltaTime = clock.getDelta();

        if (update) {
            update(deltaTime);
        }

        renderer.render(
            scene,
            camera
        );
    }

    animate();
}