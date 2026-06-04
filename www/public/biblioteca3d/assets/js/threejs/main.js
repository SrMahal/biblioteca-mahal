import * as THREE from 'https://esm.sh/three@0.160.0';

import { createScene } from './core/scene.js';
import { createRenderer } from './core/renderer.js';
import { createWorldLights } from './world/lights.js';
import { createCamera } from './core/camera.js';
import { createFloor } from './world/floor.js';
import { createMouseLight } from './world/mouseLight.js';
import { createNotes } from './world/notes.js';
import { createImageCards } from './world/imageCards.js';
import { createComputerScreen } from './world/computerScreen.js';
import { createTextBlocks } from './world/textBlocks.js';
import { createCubes } from './world/cubes.js';
import { createModels3D } from './world/model3d.js';
import { createColliders } from './world/colliders.js';

import { createControls } from './core/controls.js';
import { setupResize } from './core/resize.js';
import { startAnimationLoop } from './core/animationLoop.js';

import { setupPopup } from './ui/popup.js';
import { setupLoadingScreen } from './ui/loadingScreen.js';

import { setupComputerScreenInteraction } from './systems/computerScreenInteraction.js';

import { createLocalPlayer } from './player/playerManager.js';
import { createPlayerCamera } from './player/playerCamera.js';

const scene = createScene();
const renderer = createRenderer();

const cameraData = createCamera();
const camera = cameraData.camera;
const cameraSettings = cameraData.cameraSettings;
const cameraTarget = cameraData.cameraTarget;

let cameraDistance = cameraData.cameraDistance;

createWorldLights(scene);

const floor = createFloor(scene);
const cubes = createCubes({ scene });

const modelColliders = createModels3D({
    scene
});

const colliders = createColliders({
    floor,
    cubes: [
        ...cubes,
        ...modelColliders
    ]
});

const localPlayer = createLocalPlayer({
    scene,
    camera,
    colliders
});

const computerScreen = createComputerScreen({
    scene,
    renderer,
    x: 0,
    y: 5,
    z: -12.5,
    width: 12,
    height: 7,
    rotationX: -0.6
});

createMouseLight({
    scene,
    renderer,
    camera,
    floor
});

createNotes({ scene, renderer });
createImageCards({ scene, renderer });
createTextBlocks({ scene });

setupComputerScreenInteraction({
    renderer,
    camera,
    screen: computerScreen,
    cameraTarget,

    getCameraDistance: () => cameraDistance,

    setCameraDistance: (value) => {
        cameraDistance = value;
    }
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

const playerCamera = createPlayerCamera({
    renderer,
    camera,
    playerModel: localPlayer.model
});

const playButton = document.getElementById("playButton");

playButton.addEventListener("click", () => {
    boardControls.setEnabled(false);
    playerCamera.setEnabled(true);
    playButton.style.display = "none";
});

let isReturningToBoard = false;

function returnToBoardMode() {
    if (isReturningToBoard) return;

    isReturningToBoard = true;

    playerCamera.setEnabled(false);
    boardControls.setEnabled(false);

    playButton.style.display = "block";

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

startAnimationLoop({
    renderer,
    scene,
    camera,

    update: (deltaTime) => {
        localPlayer.controller.update(deltaTime);
        playerCamera.update(deltaTime);
    }
});