import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createPlayerCamera({
    renderer,
    camera,
    playerModel
}) {
    let enabled = false;

    let yaw = 0;
    let pitch = -0.25;

    const settings = {
        distance: 8,
        height: 3.2,
        lookHeight: 1.5,
        mouseSensitivity: 0.003,
        positionSmooth: 0.045,
        minPitch: -0.75,
        maxPitch: 0.25,
        minCameraY: 1.2
    };

    const desiredPosition = new THREE.Vector3();
    const target = new THREE.Vector3();

    function getTargetObject() {
        return playerModel.group ?? playerModel;
    }

    function setEnabled(value) {
        enabled = value;

        if (!enabled) {
            document.exitPointerLock?.();
            return;
        }

        const targetObject = getTargetObject();

        const offsetX = camera.position.x - targetObject.position.x;
        const offsetZ = camera.position.z - targetObject.position.z;

        yaw = Math.atan2(offsetX, offsetZ);

        renderer.domElement.requestPointerLock?.();
    }

    function isEnabled() {
        return enabled;
    }

    document.addEventListener("mousemove", (event) => {
        if (!enabled) return;
        if (document.pointerLockElement !== renderer.domElement) return;

        yaw -= event.movementX * settings.mouseSensitivity;
        pitch -= event.movementY * settings.mouseSensitivity;

        pitch = THREE.MathUtils.clamp(
            pitch,
            settings.minPitch,
            settings.maxPitch
        );
    });

    function update(deltaTime) {
        if (!enabled) return;
        if (!playerModel) return;

        const targetObject = getTargetObject();

        if (!targetObject || !targetObject.position) return;

        const playerPosition = targetObject.position;

        const horizontalDistance =
            settings.distance * Math.cos(pitch);

        const verticalOffset =
            settings.height + Math.sin(pitch) * settings.distance;

        desiredPosition.set(
            playerPosition.x + Math.sin(yaw) * horizontalDistance,
            playerPosition.y + verticalOffset,
            playerPosition.z + Math.cos(yaw) * horizontalDistance
        );

        desiredPosition.y = Math.max(
            desiredPosition.y,
            settings.minCameraY
        );

        target.set(
            playerPosition.x,
            playerPosition.y + settings.lookHeight,
            playerPosition.z
        );

        const smooth =
            1 - Math.pow(
                1 - settings.positionSmooth,
                deltaTime * 60
            );

        camera.position.lerp(
            desiredPosition,
            smooth
        );

        camera.lookAt(target);
    }

    return {
        setEnabled,
        isEnabled,
        update
    };
}