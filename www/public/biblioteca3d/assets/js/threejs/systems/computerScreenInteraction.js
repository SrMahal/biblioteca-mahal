import * as THREE from 'https://esm.sh/three@0.160.0';

export function setupComputerScreenInteraction({
    renderer,
    camera,
    screen,
    cameraTarget,
    getCameraDistance,
    setCameraDistance
}) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const mobileInput = document.getElementById("mobileTerminalInput");

    function animateCameraToScreen() {
        const isMobile = window.innerWidth < 768;

        const startTarget = cameraTarget.clone();
        const endTarget = screen.position.clone();

        if (isMobile) {
            endTarget.x -= 3.5;
            endTarget.z += 0.8;
        }

        const startDistance = getCameraDistance();

        // maior = menos zoom
        const endDistance = isMobile ? 17 : 16;

        let progress = 0;

        function animate() {
            progress += 0.035;

            const t = Math.min(progress, 1);
            const smooth = t * t * (3 - 2 * t);

            cameraTarget.lerpVectors(startTarget, endTarget, smooth);

            const currentDistance = THREE.MathUtils.lerp(
                startDistance,
                endDistance,
                smooth
            );

            setCameraDistance(currentDistance);

            const zOffsetRatio = 18 / 46;

            // no mobile desce um pouco a câmera
            const mobileYOffset = isMobile ? -2.5 : 0;

            camera.position.set(
                cameraTarget.x,
                currentDistance + mobileYOffset,
                cameraTarget.z + currentDistance * zOffsetRatio
            );

            camera.lookAt(cameraTarget);

            if (t < 1) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    renderer.domElement.addEventListener("click", (event) => {
        const rect = renderer.domElement.getBoundingClientRect();

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObject(screen);

        if (hits.length > 0) {
            mobileInput?.focus();
            animateCameraToScreen();
        }
    });
}