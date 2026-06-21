import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createPlayerCamera({
    renderer,
    camera,
    playerModel,
    colliders = [],
    mobileInput = null
}) {
    let enabled = false;
    let lookEnabled = true;

    let yaw = 0;
    let pitch = -0.25;

    const settings = {
        distance: 8,
        minDistance: 2.2,

        height: 3.2,
        lookHeight: 1.5,

        cameraRadius: 0.35,

        mouseSensitivity: 0.003,
        mobileSensitivity: 0.009,

        positionSmooth: 0.045,

        minPitch: -0.75,
        maxPitch: 0.25,

        minCameraY: 1.2
    };

    const desiredPosition = new THREE.Vector3();
    const safePosition = new THREE.Vector3();
    const target = new THREE.Vector3();

    const cameraRay = new THREE.Raycaster();
    const rayDirection = new THREE.Vector3();

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

        const offsetX =
            camera.position.x -
            targetObject.position.x;

        const offsetZ =
            camera.position.z -
            targetObject.position.z;

        yaw = Math.atan2(offsetX, offsetZ);

        if (lookEnabled) {
            renderer.domElement.requestPointerLock?.();
        }
    }

    function setLookEnabled(value) {
        lookEnabled = value;

        if (!lookEnabled) {
            document.exitPointerLock?.();
            return;
        }

        if (enabled) {
            renderer.domElement.requestPointerLock?.();
        }
    }

    function isEnabled() {
        return enabled;
    }

    document.addEventListener("mousemove", (event) => {
        if (!enabled) return;
        if (!lookEnabled) return;
        if (document.pointerLockElement !== renderer.domElement) return;

        yaw -=
            event.movementX *
            settings.mouseSensitivity;

        pitch -=
            event.movementY *
            settings.mouseSensitivity;

        pitch =
            THREE.MathUtils.clamp(
                pitch,
                settings.minPitch,
                settings.maxPitch
            );
    });

    function resolveCameraCollision() {
        safePosition.copy(desiredPosition);

        rayDirection
            .subVectors(
                desiredPosition,
                target
            )
            .normalize();

        const distanceToDesired =
            target.distanceTo(
                desiredPosition
            );

        cameraRay.set(
            target,
            rayDirection
        );

        cameraRay.far =
            distanceToDesired;

        const hits =
            cameraRay.intersectObjects(
                colliders,
                true
            );

        if (hits.length > 0) {
            const hit = hits[0];

            const correctedDistance =
                Math.max(
                    hit.distance - settings.cameraRadius,
                    settings.minDistance
                );

            safePosition.copy(
                target
            ).add(
                rayDirection.multiplyScalar(
                    correctedDistance
                )
            );
        }

        safePosition.y =
            Math.max(
                safePosition.y,
                settings.minCameraY
            );
    }

    function update(deltaTime) {
        if (!enabled) return;
        if (!playerModel) return;

        const targetObject =
            getTargetObject();

        if (
            !targetObject ||
            !targetObject.position
        ) {
            return;
        }

        if (mobileInput && lookEnabled) {
            yaw -=
                mobileInput.lookX *
                settings.mobileSensitivity;

            pitch -=
                mobileInput.lookY *
                settings.mobileSensitivity;

            mobileInput.lookX = 0;
            mobileInput.lookY = 0;

            pitch =
                THREE.MathUtils.clamp(
                    pitch,
                    settings.minPitch,
                    settings.maxPitch
                );
        }

        const playerPosition =
            targetObject.position;

        const horizontalDistance =
            settings.distance *
            Math.cos(pitch);

        const verticalOffset =
            settings.height +
            Math.sin(pitch) *
            settings.distance;

        target.set(
            playerPosition.x,
            playerPosition.y +
            settings.lookHeight,
            playerPosition.z
        );

        desiredPosition.set(
            playerPosition.x +
            Math.sin(yaw) *
            horizontalDistance,
            playerPosition.y +
            verticalOffset,
            playerPosition.z +
            Math.cos(yaw) *
            horizontalDistance
        );

        desiredPosition.y =
            Math.max(
                desiredPosition.y,
                settings.minCameraY
            );

        resolveCameraCollision();

        const smooth =
            1 - Math.pow(
                1 - settings.positionSmooth,
                deltaTime * 60
            );

        camera.position.lerp(
            safePosition,
            smooth
        );

        camera.lookAt(target);
    }

    return {
        setEnabled,
        setLookEnabled,
        isEnabled,
        update,

        getYaw() {
            return yaw;
        }
    };
}