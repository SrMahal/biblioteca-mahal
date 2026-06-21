import * as THREE from "three";

import {
    socket,
    joinWorld,
    onServerState
} from './network/socketClient.js';

import {
    setupRemotePlayers,
    updateRemotePlayers,
    getRemoteObjectById
} from "./network/remotePlayers.js";

import {
    setupVoice
} from "./network/voiceClient.js";

import { createScene } from './core/scene.js';
import { createRenderer } from './core/renderer.js';
import { createWorldLights } from './world/lights.js';
import { createCamera } from './core/camera.js';
import { createFloor } from './world/floor.js';

import { createControls } from './core/controls.js';

import {
    setupMobileControls,
    showMobileControls,
    hideMobileControls,
    mobileInput
} from "./mobile/mobileControls.js";

import { setupResize } from './core/resize.js';
import { startAnimationLoop } from './core/animationLoop.js';

import { setupPopup } from './ui/popup.js';
import { setupLoadingScreen } from './ui/loadingScreen.js';

import { createLocalPlayer } from './player/playerManager.js';
import { createPlayerCamera } from './player/playerCamera.js';
import { getPlayerIdentity } from "./network/gameIdentity.js";

import { setupPhone } from "./phone/phoneManager.js";

const scene = createScene();
const renderer = createRenderer();

setupMobileControls();
hideMobileControls();

const cameraData = createCamera();
const camera = cameraData.camera;
const cameraSettings = cameraData.cameraSettings;
const cameraTarget = cameraData.cameraTarget;

let cameraDistance = cameraData.cameraDistance;

createWorldLights(scene);

createFloor(scene);

const colliders = [];

setupRemotePlayers(scene);

let playerCamera = null;

const localPlayer = createLocalPlayer({
    scene,
    camera,
    colliders,
    mobileInput,

    getCameraYaw: () => {
        return playerCamera
            ? playerCamera.getYaw()
            : 0;
    }
});

window.__localPlayerObject =
    localPlayer.model.group ?? localPlayer.model;

playerCamera = createPlayerCamera({
    renderer,
    camera,
    playerModel: localPlayer.model,
    colliders,
    mobileInput
});

const identity = await getPlayerIdentity();

joinWorld({
    worldId: "biblioteca-central",
    userId: identity.id,
    name: identity.name || "Jogador",
    isGuest: identity.isGuest
});

onServerState((data) => {
    const players = data.players || [];

    const me = players.find((player) => {
        return player.id === socket.id;
    });

    if (!me) return;

    localPlayer.state.serverPosition.x = me.position.x;
    localPlayer.state.serverPosition.y = me.position.y;
    localPlayer.state.serverPosition.z = me.position.z;

    localPlayer.state.serverRotationY = me.rotation.y;
    localPlayer.state.currentAnimation = me.animation || "Idle";
});

const boardControls = createControls({
    renderer,
    camera,
    cameraSettings,
    cameraTarget,

    getCameraDistance: () => cameraDistance,

    setCameraDistance: (value) => {
        cameraDistance = value;
    }
});

const playButton = document.getElementById("playButton");

let voiceStarted = false;
let isPlayerMode = false;
let isReturningToBoard = false;

playButton.addEventListener("click", async () => {
    playButton.blur();

    if (isPlayerMode) {
        returnToBoardMode();
        return;
    }

    isPlayerMode = true;

    boardControls.setEnabled(false);
    playerCamera.setEnabled(true);

    playButton.textContent = "ESC";
    playButton.style.display = "block";

    showMobileControls();

    if (!voiceStarted) {
        await setupVoice({
            camera,
            getRemoteObjectById
        });

        voiceStarted = true;
    }
});

function returnToBoardMode() {
    if (isReturningToBoard) return;

    isReturningToBoard = true;

    playerCamera.setEnabled(false);
    boardControls.setEnabled(false);

    isPlayerMode = false;
    playButton.textContent = "Play";
    playButton.style.display = "block";

    hideMobileControls();

    const startPosition = camera.position.clone();
    const startTarget = cameraTarget.clone();

    const endTarget = new THREE.Vector3(0, 0, 0);
    const endDistance = cameraSettings.distance;

    const zOffsetRatio =
        cameraSettings.tiltZ / cameraSettings.distance;

    const endPosition = new THREE.Vector3(
        endTarget.x,
        endDistance,
        endTarget.z + endDistance * zOffsetRatio
    );

    let progress = 0;

    function animateReturn() {
        progress += 0.015;

        const t = Math.min(progress, 1);
        const smooth = t * t * (3 - 2 * t);

        camera.position.lerpVectors(
            startPosition,
            endPosition,
            smooth
        );

        cameraTarget.lerpVectors(
            startTarget,
            endTarget,
            smooth
        );

        cameraDistance = THREE.MathUtils.lerp(
            cameraDistance,
            endDistance,
            smooth
        );

        camera.lookAt(cameraTarget);

        if (t < 1) {
            requestAnimationFrame(animateReturn);
        } else {
            cameraDistance = endDistance;
            cameraTarget.copy(endTarget);

            boardControls.setEnabled(true);
            isReturningToBoard = false;
        }
    }

    animateReturn();
}

document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement !== renderer.domElement) {
        if (window.__phoneOpening) return;

        returnToBoardMode();
    }
});

setupResize({
    renderer,
    camera,
    scene
});

setupPopup();
setupLoadingScreen();
setupPhone({
    onOpen: () => {
        playerCamera.setLookEnabled(false);
    },

    onClose: () => {
        if (isPlayerMode) {
            setTimeout(() => {
                playerCamera.setLookEnabled(true);
            }, 120);
        }
    }
});

startAnimationLoop({
    renderer,
    scene,
    camera,

    update(deltaTime) {
        localPlayer.controller.update(deltaTime);
        playerCamera.update(deltaTime);
        updateRemotePlayers(deltaTime);
    }
});