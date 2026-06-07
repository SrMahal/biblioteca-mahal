// world/imageCards.js

import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

function createImageCard({
    scene,
    renderer,

    x = 0,
    y = 0.9,
    z = 0,

    rotationX = -Math.PI / 3,
    rotationY = 0,
    rotationZ = 0,

    imageUrl,
    width = 6,
    height = null,

    castShadow = true,
    receiveShadow = true
}) {
    const loader = new THREE.TextureLoader();

    loader.load(
        imageUrl,
        (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;

            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;

            const aspect = texture.image.height / texture.image.width;
            const finalHeight = height ?? width * aspect;

            const geometry = new THREE.PlaneGeometry(width, finalHeight);

            const material = new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                depthWrite: false,
                side: THREE.DoubleSide,
                roughness: 0.8,
                metalness: 0,
            });

            const imagePlane = new THREE.Mesh(geometry, material);

            imagePlane.position.set(x, y, z);
            imagePlane.rotation.set(rotationX, rotationY, rotationZ);

            imagePlane.castShadow = castShadow;
            imagePlane.receiveShadow = receiveShadow;

            scene.add(imagePlane);
        },
        undefined,
        (error) => {
            console.error("Erro ao carregar imagem:", imageUrl, error);
        }
    );
}

export function createImageCards({ scene, renderer }) {
    createImageCard({
        scene,
        renderer,
        x: 0,
        y: 0.9,
        z: 1.5,
        rotationX: -Math.PI / 3,
        width: 18,
        imageUrl: '/biblioteca3d/assets/img/logos/logo-mark-biblioteca.png',
    });

    createImageCard({
        scene,
        renderer,
        x: -9,
        y: 2.0,
        z: -10,
        rotationX: -Math.PI / 3,
        width: 3.5,
        imageUrl: '/biblioteca3d/assets/img/elementos/arrown-left-up.png',
    });

    createImageCard({
        scene,
        renderer,
        x: -12,
        y: 0.7,
        z: 0,
        rotationX: -Math.PI / 3,
        width: 5,
        imageUrl: '/biblioteca3d/assets/img/elementos/arrown-left.png',
    });

    createImageCard({
        scene,
        renderer,
        x: -8,
        y: 0.9,
        z: 6,
        rotationX: -Math.PI / 3,
        width: 3.5,
        imageUrl: '/biblioteca3d/assets/img/elementos/arrown-left-down.png',
    });

    createImageCard({
        scene,
        renderer,
        x: 9,
        y: 2.7,
        z: -8,
        rotationX: -Math.PI / 3,
        width: 3.5,
        imageUrl: '/biblioteca3d/assets/img/elementos/arrown-rigth-up.png',
    });

    createImageCard({
        scene,
        renderer,
        x: 12,
        y: 0.7,
        z: 0,
        rotationX: -Math.PI / 3,
        width: 3.5,
        imageUrl: '/biblioteca3d/assets/img/elementos/arrown-rigth.png',
    });

    createImageCard({
        scene,
        renderer,
        x: 8,
        y: 1,
        z: 6,
        rotationX: -Math.PI / 3,
        width: 3.5,
        imageUrl: '/biblioteca3d/assets/img/elementos/arrown-right-down.png',
    });

    createImageCard({
        scene,
        renderer,
        x: -5,
        y: 0.12,
        z: 8.5,
        rotationX: -Math.PI / 2,
        width: 2.5,
        imageUrl: '/biblioteca3d/assets/img/fotos/mahal.png',
        castShadow: false,
        receiveShadow: false
    });

    createImageCard({
        scene,
        renderer,
        x: 0,
        y: 0.12,
        z: 8.5,
        rotationX: -Math.PI / 2,
        width: 2.5,
        imageUrl: '/biblioteca3d/assets/img/fotos/mario.png',
        castShadow: false,
        receiveShadow: false
    });

    
}