import * as THREE from 'https://esm.sh/three@0.160.0';

export function createPlayerController({
    playerState,
    playerModel,
    camera,
    playerPhysics
}) {
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false,
        space: false
    };

    const moveDirection =
        new THREE.Vector3();

    const cameraForward =
        new THREE.Vector3();

    const cameraRight =
        new THREE.Vector3();

    const up =
        new THREE.Vector3(0, 1, 0);

    window.addEventListener(
        "keydown",
        (event) => {
            const key =
                event.key.toLowerCase();

            if (key === "shift") {
                keys.shift = true;
            }

            if (key === " ") {
                keys.space = true;
            }

            if (key in keys) {
                keys[key] = true;
            }
        }
    );

    window.addEventListener(
        "keyup",
        (event) => {
            const key =
                event.key.toLowerCase();

            if (key === "shift") {
                keys.shift = false;
            }

            if (key === " ") {
                keys.space = false;
            }

            if (key in keys) {
                keys[key] = false;
            }
        }
    );

    function update(deltaTime) {
        const previousPosition = {
            x: playerState.position.x,
            y: playerState.position.y,
            z: playerState.position.z
        };

        const walkSpeed = 5;
        const runSpeed = 10;

        const speed =
            keys.shift
                ? runSpeed
                : walkSpeed;

        moveDirection.set(
            0,
            0,
            0
        );

        camera.getWorldDirection(
            cameraForward
        );

        cameraForward.y = 0;
        cameraForward.normalize();

        cameraRight
            .crossVectors(
                cameraForward,
                up
            )
            .normalize();

        if (keys.w) {
            moveDirection.add(
                cameraForward
            );
        }

        if (keys.s) {
            moveDirection.sub(
                cameraForward
            );
        }

        if (keys.a) {
            moveDirection.sub(
                cameraRight
            );
        }

        if (keys.d) {
            moveDirection.add(
                cameraRight
            );
        }

        playerState.isMoving =
            moveDirection.lengthSq() > 0;

        if (keys.space) {
            const jumped =
                playerPhysics.jump();

            if (jumped) {
                keys.space = false;
            }
        }

        if (playerState.isMoving) {
            moveDirection.normalize();

            playerState.position.x +=
                moveDirection.x *
                speed *
                deltaTime;

            playerState.position.z +=
                moveDirection.z *
                speed *
                deltaTime;

            playerState.rotation.y =
                Math.atan2(
                    moveDirection.x,
                    moveDirection.z
                );
        }

        const group =
            playerModel.group ?? playerModel;

        group.rotation.y =
            playerState.rotation.y;

        if (!playerPhysics.getIsGrounded()) {
            playerModel.playAnimation?.("Jump");
        } else if (playerState.isMoving) {
            playerModel.playAnimation?.(
                keys.shift
                    ? "Run"
                    : "Walk"
            );
        } else {
            playerModel.playAnimation?.("Idle");
        }

        playerPhysics.update(
            deltaTime,
            previousPosition
        );

        playerModel.update?.(
            deltaTime
        );
    }

    return {
        update
    };
}