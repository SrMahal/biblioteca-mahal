(function () {
    'use strict';

    function initHome3D() {
        if (!window.THREE) {
            console.error('THREE não carregado.');
            return;
        }

        const canvas = document.getElementById('banner3d');
        if (!canvas) return;

        const THREE = window.THREE;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
        camera.position.set(0, 1.2, 10);

        const amb = new THREE.AmbientLight(0xffffff, 0.55);
        scene.add(amb);

        const key = new THREE.PointLight(0x7c2cff, 2.2, 60);
        key.position.set(0, 8, 10);
        scene.add(key);

        const fill = new THREE.PointLight(0xff6600, 1.2, 55);
        fill.position.set(-10, 2, 8);
        scene.add(fill);

        const rim = new THREE.PointLight(0xffffff, 0.6, 80);
        rim.position.set(12, 6, -10);
        scene.add(rim);

        const group = new THREE.Group();
        scene.add(group);

        const floorGeo = new THREE.PlaneGeometry(40, 16, 1, 1);
        const floorMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.0
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.2;
        group.add(floor);

        const particleCount = 2400;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorA = new THREE.Color(0x7c2cff);
        const colorB = new THREE.Color(0xff6600);
        const colorC = new THREE.Color(0xffffff);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            positions[i3 + 0] = (Math.random() - 0.5) * 26;
            positions[i3 + 1] = (Math.random() - 0.2) * 9;
            positions[i3 + 2] = (Math.random() - 0.5) * 18;

            const t = Math.random();
            const c = t < 0.60 ? colorA : (t < 0.90 ? colorB : colorC);

            colors[i3 + 0] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMat = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeo, particlesMat);
        group.add(particles);

        function makeOrbit(radius, tiltX, tiltY, color, opacity) {
            const curvePts = [];
            const segments = 320;

            for (let i = 0; i <= segments; i++) {
                const a = (i / segments) * Math.PI * 2;
                curvePts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
            }

            const geo = new THREE.BufferGeometry().setFromPoints(curvePts);
            const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
            const line = new THREE.Line(geo, mat);

            line.rotation.x = tiltX;
            line.rotation.y = tiltY;

            return line;
        }

        const orbits = new THREE.Group();
        orbits.add(makeOrbit(3.8, 0.9, 0.2, 0x7c2cff, 0.28));
        orbits.add(makeOrbit(4.6, 1.1, 1.1, 0xff6600, 0.20));
        orbits.add(makeOrbit(2.9, 0.6, 2.0, 0xffffff, 0.10));
        orbits.position.y = 0.5;
        group.add(orbits);

        const books = new THREE.Group();
        const bookGeo = new THREE.BoxGeometry(0.06, 0.8, 0.18);

        for (let i = 0; i < 52; i++) {
            const mat = new THREE.MeshStandardMaterial({
                color: Math.random() < 0.7 ? 0x7c2cff : 0xff6600,
                emissive: Math.random() < 0.7 ? 0x26004d : 0x2a1300,
                emissiveIntensity: 0.9,
                metalness: 0.1,
                roughness: 0.55
            });

            const m = new THREE.Mesh(bookGeo, mat);
            const row = i < 26 ? 0 : 1;
            const col = i % 26;

            m.position.x = -6.2 + col * 0.5;
            m.position.y = -1.4 + row * 0.95;
            m.position.z = -4.8 + (Math.sin(col * 0.35 + row) * 0.25);
            m.rotation.y = (Math.random() - 0.5) * 0.35;
            m.scale.y = 0.65 + Math.random() * 0.65;

            books.add(m);
        }

        group.add(books);

        const mouse = { x: 0, y: 0 };
        let hasPointer = false;

        window.addEventListener('mousemove', (e) => {
            const r = canvas.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width;
            const ny = (e.clientY - r.top) / r.height;

            mouse.x = (nx - 0.5) * 2;
            mouse.y = (ny - 0.5) * 2;
            hasPointer = true;
        }, { passive: true });

        function resize() {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;

            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', resize);
        resize();

        const clock = new THREE.Clock();

        function tick() {
            const t = clock.getElapsedTime();

            group.rotation.y = Math.sin(t * 0.12) * 0.08;
            group.rotation.x = Math.sin(t * 0.10) * 0.03;

            particlesMat.size = 0.055 + (Math.sin(t * 1.2) * 0.006);

            orbits.rotation.y = t * 0.10;
            orbits.rotation.x = 0.9 + Math.sin(t * 0.15) * 0.05;

            books.children.forEach((b, i) => {
                b.position.z = -4.8 + Math.sin(t * 0.8 + i * 0.25) * 0.18;
            });

            if (hasPointer) {
                camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 1.0, 0.05);
                camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2 + (-mouse.y * 0.7), 0.05);
                camera.lookAt(0, 0.2, 0);
            } else {
                camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t * 0.18) * 0.45, 0.02);
                camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2 + Math.sin(t * 0.13) * 0.12, 0.02);
                camera.lookAt(0, 0.2, 0);
            }

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }

        tick();
    }

    window.addEventListener('DOMContentLoaded', initHome3D);
})();