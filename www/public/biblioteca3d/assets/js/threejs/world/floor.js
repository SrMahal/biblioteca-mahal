import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createFloor(scene) {

    const boardSize = 240;

    const floorGeometry = new THREE.PlaneGeometry(
        boardSize,
        boardSize
    );

    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0,
    });

    const floor = new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

    floor.receiveShadow = true;

    floor.rotation.x = -Math.PI / 2;

    floor.position.y = 0;

    floor.userData.type = "floor";

    scene.add(floor);

    return floor;
}