import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createMouseLight({
    scene,
    renderer,
    camera,
    floor
}) {

    const mouseLight = new THREE.PointLight();

    mouseLight.color.set(0xffffff);

    mouseLight.intensity = 35;
    mouseLight.distance = 45;
    mouseLight.decay = 2;

    mouseLight.position.set(0, 12, 0);

    mouseLight.castShadow = true;

    mouseLight.shadow.mapSize.width = 512;
    mouseLight.shadow.mapSize.height = 512;

    mouseLight.shadow.bias = -0.0005;

    mouseLight.shadow.camera.near = 1;
    mouseLight.shadow.camera.far = 80;

    scene.add(mouseLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function moveMouseLight(event) {

        const rect =
            renderer.domElement.getBoundingClientRect();

        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects =
            raycaster.intersectObject(floor);

        if (intersects.length > 0) {

            const point = intersects[0].point;

            mouseLight.position.set(
                point.x,
                12,
                point.z
            );
        }
    }

    renderer.domElement.addEventListener(
        "pointermove",
        moveMouseLight
    );

    return mouseLight;
}