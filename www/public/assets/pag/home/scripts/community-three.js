import * as THREE from "https://esm.sh/three@0.160.0";

const canvas = document.getElementById("community-canvas");

if (canvas) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // PARTICLES
    const count = 800;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x5865F2
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ANIMAÇÃO
    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0003;

        renderer.render(scene, camera);
    }

    animate();

    // RESPONSIVO
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}