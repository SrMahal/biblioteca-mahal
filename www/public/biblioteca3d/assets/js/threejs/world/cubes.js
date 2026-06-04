import * as THREE from 'https://esm.sh/three@0.160.0';

function createCube({
    scene,
    x = 0,
    y = 1,
    z = 0,
    width = 2,
    height = 2,
    depth = 2,
    color = 0x111111
}) {
    const geometry = new THREE.BoxGeometry(width, height, depth);

    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.45,
        metalness: 0.05,
    });

    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;

    scene.add(cube);

    return cube;
}

export function createCubes({ scene }) {
    const cubes = [];

    cubes.push(createCube({
        scene,
        x: -10,
        y: 1,
        z: -4,
        width: 2,
        height: 2,
        depth: 2,
        color: 0x111111
    }));

    cubes.push(createCube({
        scene,
        x: 10,
        y: 3,
        z: 18,
        width: 2,
        height: 6,
        depth: 2,
        color: 0x4f46e5
    }));

    cubes.push(createCube({
        scene,
        x: -7,
        y: 5,
        z: 10,
        width: 1,
        height: 1,
        depth: 1,
        color: 0xff9900
    }));

    return cubes;
}