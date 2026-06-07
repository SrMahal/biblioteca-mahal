import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createCamera() {
    const cameraSettings = {
        distance: 46,
        minDistance: 18,
        maxDistance: 90,
        tiltZ: 18,
    };

    const cameraTarget = new THREE.Vector3(0, 0, 0);
    let cameraDistance = cameraSettings.distance;

    function createPerspectiveCamera() {
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.set(
            cameraTarget.x,
            cameraDistance,
            cameraTarget.z + cameraSettings.tiltZ
        );

        camera.lookAt(cameraTarget);

        return camera;
    }

    const camera = createPerspectiveCamera();

    return {
        camera,
        cameraSettings,
        cameraTarget,
        cameraDistance
    };
}