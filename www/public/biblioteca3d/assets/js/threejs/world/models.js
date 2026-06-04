import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader }
from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

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

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.45,
            metalness: 0.05,
        });

    const cube =
        new THREE.Mesh(
            geometry,
            material
        );

    cube.position.set(x,y,z);

    cube.castShadow = true;
    cube.receiveShadow = true;

    scene.add(cube);

    return cube;
}

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
    receiveShadow = true
}) {

    const loader =
        new GLTFLoader();

    loader.load(
        modelUrl,

        (gltf) => {

            const model =
                gltf.scene;

            model.position.set(
                x,
                y,
                z
            );

            model.scale.set(
                scale,
                scale,
                scale
            );

            model.rotation.set(
                rotationX,
                rotationY,
                rotationZ
            );

            model.traverse((child)=>{

                if(child.isMesh){

                    child.castShadow =
                        castShadow;

                    child.receiveShadow =
                        receiveShadow;
                }
            });

            scene.add(model);
        },

        undefined,

        (error)=>{
            console.error(
                "Erro GLB:",
                error
            );
        }
    );
}

export function createModels({
    scene
}) {

    createCube({
        scene,

        x:-10,
        y:1,
        z:-4,

        color:0x111111
    });

    createCube({
        scene,

        x:10,
        y:3,
        z:18,

        height:6,

        color:0x4f46e5
    });

    createCube({
        scene,

        x:-7,
        y:5,
        z:10,

        width:1,
        height:1,
        depth:1,

        color:0xff9900
    });

    createModel3D({
        scene,

        modelUrl:
        "/biblioteca3d/assets/js/threejs/model3d/notebook_p1.glb",

        x:0,
        y:1.5,
        z:-5,

        scale:3,

        rotationX:-0.5
    });

    createModel3D({
        scene,

        modelUrl:
        "/biblioteca3d/assets/js/threejs/model3d/ssh.glb",

        x:0,
        y:1.5,
        z:-5,

        scale:3,

        rotationX:-0.5
    });

    createModel3D({
        scene,

        modelUrl:
        "/biblioteca3d/assets/js/threejs/model3d/office_desk.glb",

        x:0,
        y:0,
        z:-15,

        scale:15,

        rotationY:3.1
    });
}