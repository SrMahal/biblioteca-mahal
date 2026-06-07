import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export const CAMERA_MODES = {
    BOARD: "BOARD",
    TRANSITION: "TRANSITION",
    THIRD_PERSON: "THIRD_PERSON",
};

export function createCameraModes({
    camera,
    cameraTarget,
    getCameraDistance,
    setCameraDistance,
    cameraSettings,
    playerModel
}) {
    let mode = CAMERA_MODES.BOARD;

    const thirdPersonSettings = {
        distance: 7,
        height: 4,
        lookHeight: 1.6,
        smooth: 0.08
    };

    function setMode(nextMode) {
        mode = nextMode;
    }

    function transitionToPlayer() {
        mode = CAMERA_MODES.TRANSITION;

        const startTarget = cameraTarget.clone();
        const startDistance = getCameraDistance();

        const endTarget = playerModel.position.clone();
        endTarget.y = 0;

        const endDistance = 12;

        let progress = 0;

        function animateTransition() {
            progress += 0.025;

            const t = Math.min(progress, 1);
            const smooth = t * t * (3 - 2 * t);

            cameraTarget.lerpVectors(
                startTarget,
                endTarget,
                smooth
            );

            const currentDistance = THREE.MathUtils.lerp(
                startDistance,
                endDistance,
                smooth
            );

            setCameraDistance(currentDistance);

            camera.position.set(
                cameraTarget.x,
                currentDistance,
                cameraTarget.z + 10
            );

            camera.lookAt(
                playerModel.position.x,
                playerModel.position.y + 1.5,
                playerModel.position.z
            );

            if (t < 1) {
                requestAnimationFrame(animateTransition);
            } else {
                mode = CAMERA_MODES.THIRD_PERSON;
            }
        }

        animateTransition();
    }

    function updateThirdPersonCamera() {
        if (!playerModel) return;

        const playerPosition = playerModel.position;

        const playerDirection = new THREE.Vector3(0, 0, 1);
        playerDirection.applyQuaternion(playerModel.quaternion);

        const cameraOffset = playerDirection
            .clone()
            .multiplyScalar(-thirdPersonSettings.distance);

        cameraOffset.y = thirdPersonSettings.height;

        const desiredPosition = playerPosition
            .clone()
            .add(cameraOffset);

        const desiredTarget = playerPosition.clone();
        desiredTarget.y += thirdPersonSettings.lookHeight;

        camera.position.lerp(
            desiredPosition,
            thirdPersonSettings.smooth
        );

        camera.lookAt(desiredTarget);
    }

    function update() {
        if (mode === CAMERA_MODES.THIRD_PERSON) {
            updateThirdPersonCamera();
        }
    }

    return {
        mode,
        setMode,
        transitionToPlayer,
        update
    };
}