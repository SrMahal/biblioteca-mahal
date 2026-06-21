import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function createFloor(scene) {
    const group = new THREE.Group();
    group.userData.type = "floor";

    scene.add(group);

    const loader = new GLTFLoader();

    loader.load(
        "/biblioteca3d/assets/js/threejs/model3d/terrain.glb",

        (gltf) => {
            const terrain = gltf.scene;

            terrain.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = false;
                    child.userData.type = "floor";
                }
            });

            group.add(terrain);

            console.log("Terreno visual carregado");
        },

        undefined,

        (error) => {
            console.error("Erro ao carregar terreno:", error);
        }
    );

    return group;
}