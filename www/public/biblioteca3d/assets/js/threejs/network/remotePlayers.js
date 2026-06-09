import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { socket } from "./socketClient.js";

const remotePlayers = new Map();

let showNames = false;

function setRemoteNamesVisible(value) {
    showNames = value;

    for (const remote of remotePlayers.values()) {
        if (remote.label) {
            remote.label.visible = showNames;
        }
    }
}

window.addEventListener("keydown", (event) => {
    if (event.code !== "Tab") return;

    event.preventDefault();
    setRemoteNamesVisible(true);
});

window.addEventListener("keyup", (event) => {
    if (event.code !== "Tab") return;

    event.preventDefault();
    setRemoteNamesVisible(false);
});

function createNameLabel(name) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.roundRect?.(96, 28, 320, 72, 18);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.fillText(name || "Jogador", 256, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(3.2, 0.8, 1);

    // Sobe ou desce o nome aqui:
    sprite.position.set(0, 3.4, 0);

    sprite.renderOrder = 999;

    // Começa escondido
    sprite.visible = showNames;

    return sprite;
}

function makeClipByFrames(originalClip, name, startFrame, endFrame, fps = 24) {
    const startTime = startFrame / fps;
    const endTime = endFrame / fps;
    const tracks = [];

    originalClip.tracks.forEach((track) => {
        const times = [];
        const values = [];
        const valueSize = track.getValueSize();

        for (let i = 0; i < track.times.length; i++) {
            const time = track.times[i];

            if (time >= startTime && time <= endTime) {
                times.push(time - startTime);

                for (let j = 0; j < valueSize; j++) {
                    values.push(track.values[i * valueSize + j]);
                }
            }
        }

        if (times.length > 0) {
            const TrackType = track.constructor;
            tracks.push(new TrackType(track.name, times, values));
        }
    });

    return new THREE.AnimationClip(name, endTime - startTime, tracks);
}

function playRemoteAnimation(remote, name) {
    if (!remote.actions[name]) return;
    if (remote.currentAction === remote.actions[name]) return;

    if (remote.currentAction) {
        remote.currentAction.fadeOut(0.15);
    }

    const action = remote.actions[name];
    action.reset();
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(1);
    action.fadeIn(0.15);
    action.play();

    remote.currentAction = action;
}

function createRemoteAvatar(scene, data) {
    const group = new THREE.Group();

    group.position.set(data.x, data.y, data.z);
    group.rotation.y = data.rotationY || 0;

    scene.add(group);

    const label = createNameLabel(data.name || "Jogador");
    group.add(label);

    const remote = {
        group,
        label,
        name: data.name || "Jogador",
        model: null,
        mixer: null,
        actions: {},
        currentAction: null,
        targetPosition: new THREE.Vector3(data.x, data.y, data.z),
        targetRotationY: data.rotationY || 0
    };

    const loader = new GLTFLoader();

    loader.load(
        "/biblioteca3d/assets/js/threejs/model3d/avatar.glb",

        (gltf) => {
            const model = gltf.scene;

            model.scale.set(1, 1, 1);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                }
            });

            group.add(model);

            remote.model = model;
            remote.mixer = new THREE.AnimationMixer(model);

            const originalClip = gltf.animations[0];

            const idleClip = makeClipByFrames(originalClip, "Idle", 52, 80, 24);
            const walkClip = makeClipByFrames(originalClip, "Walk", 4, 21, 24);
            const runClip = makeClipByFrames(originalClip, "Run", 27, 47, 24);
            const jumpClip = makeClipByFrames(originalClip, "Jump", 361, 379, 24);

            remote.actions.Idle = remote.mixer.clipAction(idleClip);
            remote.actions.Walk = remote.mixer.clipAction(walkClip);
            remote.actions.Run = remote.mixer.clipAction(runClip);
            remote.actions.Jump = remote.mixer.clipAction(jumpClip);

            Object.values(remote.actions).forEach((action) => {
                action.enabled = true;
                action.clampWhenFinished = false;
                action.setLoop(THREE.LoopRepeat, Infinity);
            });

            playRemoteAnimation(remote, data.animation || "Idle");
        },

        undefined,

        (error) => {
            console.error("Erro ao carregar avatar remoto:", error);
        }
    );

    return remote;
}

export function setupRemotePlayers(scene) {
    socket.on("player-state", (data) => {
        if (data.id === socket.id) return;

        let remote = remotePlayers.get(data.id);

        if (!remote) {
            remote = createRemoteAvatar(scene, data);
            remotePlayers.set(data.id, remote);
        }

        remote.targetPosition.set(data.x, data.y, data.z);
        remote.targetRotationY = data.rotationY || 0;

        playRemoteAnimation(remote, data.animation || "Idle");
    });

    socket.on("player-left", (data) => {
        const remote = remotePlayers.get(data.id);

        if (!remote) return;

        scene.remove(remote.group);

        if (remote.label?.material?.map) {
            remote.label.material.map.dispose();
        }

        if (remote.label?.material) {
            remote.label.material.dispose();
        }

        remotePlayers.delete(data.id);
    });
}

export function updateRemotePlayers(deltaTime) {
    for (const remote of remotePlayers.values()) {
        remote.group.position.lerp(
            remote.targetPosition,
            0.25
        );

        remote.group.rotation.y = THREE.MathUtils.lerp(
            remote.group.rotation.y,
            remote.targetRotationY,
            0.25
        );

        if (remote.mixer) {
            remote.mixer.update(deltaTime);
        }
    }
}

export function getRemoteObjectById(id) {
    const remote = remotePlayers.get(id);
    return remote?.group || null;
}