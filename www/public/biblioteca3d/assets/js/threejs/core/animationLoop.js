import * as THREE from 'https://esm.sh/three@0.160.0';

export function startAnimationLoop({
    renderer,
    scene,
    camera,
    update = null
}) {
    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(
            animate
        );

        const deltaTime =
            clock.getDelta();

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