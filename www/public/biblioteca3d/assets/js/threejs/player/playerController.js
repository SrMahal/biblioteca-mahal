import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";
import { sendPlayerInput } from "../network/socketClient.js";
import { isTyping } from "../utils/isTyping.js";

export function createPlayerController({
    playerState,
    playerModel,
    camera,
    playerPhysics,
    mobileInput = null,
    getCameraYaw = () => 0
}) {
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false,
        space: false
    };

    const moveDirection = new THREE.Vector3();
    const cameraForward = new THREE.Vector3();
    const cameraRight = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    const serverTargetPosition = new THREE.Vector3();

    let inputSendTimer = 0;
    const inputSendRate = 1 / 20;

    function resetKeys() {
        keys.w = false;
        keys.a = false;
        keys.s = false;
        keys.d = false;
        keys.shift = false;
        keys.space = false;
    }

    function sendEmptyInput() {
        sendPlayerInput({
            worldId: "biblioteca-central",
            input: {
                w: false,
                a: false,
                s: false,
                d: false,
                shift: false,
                jump: false,
                yaw: getCameraYaw()
            }
        });
    }

    window.addEventListener("keydown", (event) => {
        if (isTyping()) return;

        if (
            event.code === "Space" ||
            event.code === "ShiftLeft" ||
            event.code === "ShiftRight" ||
            event.code === "KeyW" ||
            event.code === "KeyA" ||
            event.code === "KeyS" ||
            event.code === "KeyD"
        ) {
            event.preventDefault();
        }

        if (event.code === "KeyW") keys.w = true;
        if (event.code === "KeyA") keys.a = true;
        if (event.code === "KeyS") keys.s = true;
        if (event.code === "KeyD") keys.d = true;

        if (
            event.code === "ShiftLeft" ||
            event.code === "ShiftRight"
        ) {
            keys.shift = true;
        }

        if (event.code === "Space") {
            keys.space = true;
        }
    });

    window.addEventListener("keyup", (event) => {
        if (isTyping()) return;

        if (
            event.code === "Space" ||
            event.code === "ShiftLeft" ||
            event.code === "ShiftRight" ||
            event.code === "KeyW" ||
            event.code === "KeyA" ||
            event.code === "KeyS" ||
            event.code === "KeyD"
        ) {
            event.preventDefault();
        }

        if (event.code === "KeyW") keys.w = false;
        if (event.code === "KeyA") keys.a = false;
        if (event.code === "KeyS") keys.s = false;
        if (event.code === "KeyD") keys.d = false;

        if (
            event.code === "ShiftLeft" ||
            event.code === "ShiftRight"
        ) {
            keys.shift = false;
        }

        if (event.code === "Space") {
            keys.space = false;
        }
    });

    function sendInputToServer(deltaTime) {
        inputSendTimer += deltaTime;

        if (inputSendTimer < inputSendRate) {
            return;
        }

        inputSendTimer = 0;

        if (isTyping()) {
            resetKeys();
            sendEmptyInput();
            return;
        }

        const mobileMoveX =
            mobileInput && mobileInput.active
                ? mobileInput.moveX
                : 0;

        const mobileMoveY =
            mobileInput && mobileInput.active
                ? mobileInput.moveY
                : 0;

        sendPlayerInput({
            worldId: "biblioteca-central",
            input: {
                w: keys.s || mobileMoveY > 0.15,
                s: keys.w || mobileMoveY < -0.15,

                a: keys.a || mobileMoveX < -0.15,
                d: keys.d || mobileMoveX > 0.15,

                shift: keys.shift,
                jump: keys.space,

                yaw: getCameraYaw()
            }
        });
    }

    function updateInputState() {
        if (isTyping()) {
            playerState.isMoving = false;
            moveDirection.set(0, 0, 0);
            return;
        }

        moveDirection.set(0, 0, 0);

        camera.getWorldDirection(cameraForward);

        cameraForward.y = 0;
        cameraForward.normalize();

        cameraRight
            .crossVectors(cameraForward, up)
            .normalize();

        if (keys.w) moveDirection.add(cameraForward);
        if (keys.s) moveDirection.sub(cameraForward);
        if (keys.a) moveDirection.sub(cameraRight);
        if (keys.d) moveDirection.add(cameraRight);

        if (mobileInput && mobileInput.active) {
            if (mobileInput.moveY < -0.15) moveDirection.add(cameraForward);
            if (mobileInput.moveY > 0.15) moveDirection.sub(cameraForward);
            if (mobileInput.moveX < -0.15) moveDirection.sub(cameraRight);
            if (mobileInput.moveX > 0.15) moveDirection.add(cameraRight);
        }

        playerState.isMoving =
            moveDirection.lengthSq() > 0;

        if (playerState.isMoving) {
            moveDirection.normalize();

            playerState.rotation.y =
                Math.atan2(
                    moveDirection.x,
                    moveDirection.z
                );
        }

        if (keys.space) {
            keys.space = false;
        }
    }

    function applyServerInterpolation(deltaTime) {
        const group =
            playerModel.group ?? playerModel;

        serverTargetPosition.set(
            playerState.serverPosition.x,
            playerState.serverPosition.y,
            playerState.serverPosition.z
        );

        const smooth =
            1 - Math.pow(
                1 - 0.35,
                deltaTime * 60
            );

        group.position.lerp(
            serverTargetPosition,
            smooth
        );

        group.rotation.y =
            THREE.MathUtils.lerp(
                group.rotation.y,
                playerState.serverRotationY,
                smooth
            );

        playerState.position.x = group.position.x;
        playerState.position.y = group.position.y;
        playerState.position.z = group.position.z;

        playerState.rotation.y = group.rotation.y;
    }

    function update(deltaTime) {
        sendInputToServer(deltaTime);
        updateInputState();
        applyServerInterpolation(deltaTime);

        if (playerState.currentAnimation) {
            playerModel.playAnimation?.(
                playerState.currentAnimation
            );
        }

        playerModel.update?.(deltaTime);
    }

    return {
        update
    };
}