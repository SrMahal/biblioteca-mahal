import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

function createModel3D({
    scene,
    modelUrl,

    x = 0,
    y = 0,
    z = 0,

    scale = 1,

    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,

    castShadow = true,
    receiveShadow = true,

    collider = null
}) {
    const loader = new GLTFLoader();

    loader.load(
        modelUrl,

        (gltf) => {
            const model = gltf.scene;

            model.position.set(x, y, z);
            model.scale.set(scale, scale, scale);
            model.rotation.set(rotationX, rotationY, rotationZ);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = castShadow;
                    child.receiveShadow = receiveShadow;
                }
            });

            scene.add(model);
        },

        undefined,

        (error) => {
            console.error("Erro ao carregar modelo 3D:", modelUrl, error);
        }
    );

    let colliderMesh = null;

    if (collider) {
        const geometry = new THREE.BoxGeometry(
            collider.width,
            collider.height,
            collider.depth
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });

        colliderMesh = new THREE.Mesh(geometry, material);

        colliderMesh.position.set(
            x + (collider.offsetX ?? 0),
            y + (collider.offsetY ?? 0),
            z + (collider.offsetZ ?? 0)
        );

        colliderMesh.rotation.set(
            collider.rotationX ?? 0,
            collider.rotationY ?? 0,
            collider.rotationZ ?? 0
        );

        colliderMesh.userData.type = "collider";

        scene.add(colliderMesh);
    }

    return {
        modelUrl,
        collider: colliderMesh
    };
}

export function createModels3D({ scene }) {
    const modelColliders = [];

    const notebook = createModel3D({
        scene,
        modelUrl: "/biblioteca3d/assets/js/threejs/model3d/notebook_p1.glb",
        x: 0,
        y: 1.5,
        z: -5,
        scale: 3,
        rotationX: -0.5,

        collider: {
            width: 18,
            height: 0.4,
            depth: 10,
            offsetY: 1,
            offsetZ: 1,
            rotationX: 9
        }
    });

    if (notebook.collider) {
        modelColliders.push(notebook.collider);
    }

    const drive = createModel3D({
        scene,
        modelUrl: "/biblioteca3d/assets/js/threejs/model3d/drive-2-mahal.glb",
        x: 0,
        y: 3.5,
        z: -5,
        scale: 3,
        rotationX: -0.5,

    });

    if (drive.collider) {
        modelColliders.push(drive.collider);
    }

    const desk = createModel3D({
        scene,
        modelUrl: "/biblioteca3d/assets/js/threejs/model3d/office_desk.glb",
        x: 0,
        y: 0,
        z: -15,
        scale: 15,
        rotationY: 3.1,


    });

    if (desk.collider) {
        modelColliders.push(desk.collider);
    }

    return modelColliders;
}