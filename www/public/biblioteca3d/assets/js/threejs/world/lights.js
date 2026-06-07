import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createWorldLights(scene) {
    createPointLight(scene, {
        x: 0,
        y: 15,
        z: 0,
        color: 0xf0f0f0,
        intensity: 200,
        distance: 40,
        castShadow: false,
        shadowSize: 512
    });

    createPointLight(scene, {
        x: 0,
        y: 15,
        z: 15,
        color: 0xf0f0f0,
        intensity: 200,
        distance: 40,
        castShadow: false,
        shadowSize: 512
    });

    createPointLight(scene, {
        x: -10,
        y: 5,
        z: -5,
        color: 0x4f46e5,
        intensity: 50,
        distance: 80
    });

    createPointLight(scene, {
        x: 10,
        y: 5,
        z: 0,
        color: 0xff9900,
        intensity: 50,
        distance: 70
    });
}

function createPointLight(scene, {
    x = 0,
    y = 5,
    z = 0,
    color = 0xffffff,
    intensity = 20,
    distance = 60,
    castShadow = true,
    shadowSize = 256
}) {
    const light = new THREE.PointLight(color, intensity, distance);

    light.position.set(x, y, z);
    light.castShadow = castShadow;

    if (castShadow) {
        light.shadow.mapSize.width = shadowSize;
        light.shadow.mapSize.height = shadowSize;
        light.shadow.bias = -0.0005;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 100;
    }

    scene.add(light);

    return light;
}