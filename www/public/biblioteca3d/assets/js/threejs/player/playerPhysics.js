import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createPlayerPhysics({
    playerState,
    playerModel,
    colliders = []
}) {
    const velocity = new THREE.Vector3();

    const settings = {
        gravity: -28,
        jumpForce: 10,

        playerHeight: 1.8,
        radius: 0.45,

        groundCheckOffset: 0.2
    };

    const downRay = new THREE.Raycaster();
    const rayOrigin = new THREE.Vector3();
    const rayDirection = new THREE.Vector3(0, -1, 0);

    const debugGeometry =
        new THREE.BoxGeometry(
            settings.radius * 2,
            settings.playerHeight,
            settings.radius * 2
        );

    const debugMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });

    const debugBox =
        new THREE.Mesh(
            debugGeometry,
            debugMaterial
        );

    playerModel.group.parent.add(debugBox);

    let isGrounded = false;

    function jump() {
        if (!isGrounded) return false;

        velocity.y = settings.jumpForce;
        isGrounded = false;

        playerModel.playAnimation?.("Jump");

        return true;
    }

    function resolveGround() {
        rayOrigin.set(
            playerState.position.x,
            playerState.position.y + settings.playerHeight,
            playerState.position.z
        );

        downRay.set(
            rayOrigin,
            rayDirection
        );

        downRay.far = 20;

        const hits =
            downRay.intersectObjects(
                colliders,
                true
            );

        if (
            hits.length > 0 &&
            velocity.y <= 0
        ) {
            playerState.position.y =
                hits[0].point.y;

            velocity.y = 0;
            isGrounded = true;

            return;
        }

        isGrounded = false;
    }

    function resolveSideCollisions(previousPosition) {
        if (!previousPosition) return;

        const playerBox =
            new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(
                    playerState.position.x,
                    playerState.position.y + settings.playerHeight / 2,
                    playerState.position.z
                ),
                new THREE.Vector3(
                    settings.radius * 2,
                    settings.playerHeight,
                    settings.radius * 2
                )
            );

        for (const collider of colliders) {
            if (!collider.geometry) continue;

            if (collider.userData.type === "floor") {
                continue;
            }

            collider.updateMatrixWorld(true);

            const colliderBox =
                new THREE.Box3().setFromObject(collider);

            if (playerBox.intersectsBox(colliderBox)) {
                const colliderTop =
                    colliderBox.max.y;

                const playerWasAbove =
                    previousPosition.y >=
                    colliderTop - 0.15;

                const playerIsFalling =
                    velocity.y <= 0;

                if (
                    playerWasAbove &&
                    playerIsFalling
                ) {
                    continue;
                }

                playerState.position.x =
                    previousPosition.x;

                playerState.position.z =
                    previousPosition.z;

                return;
            }
        }
    }

    function update(
        deltaTime,
        previousPosition = null
    ) {
        deltaTime = Math.min(deltaTime, 0.033);

        if (!colliders.length) {
            return;
        }

        if (playerState.position.y < -10) {
            playerState.position.x = 0;
            playerState.position.y = 5;
            playerState.position.z = 5;
            velocity.set(0, 0, 0);
        }

        velocity.y +=
            settings.gravity * deltaTime;

        playerState.position.y +=
            velocity.y * deltaTime;

        resolveGround();

        resolveSideCollisions(
            previousPosition
        );

        const group =
            playerModel.group ?? playerModel;

        group.position.set(
            playerState.position.x,
            playerState.position.y,
            playerState.position.z
        );

        debugBox.position.set(
            playerState.position.x,
            playerState.position.y +
            settings.playerHeight / 2,
            playerState.position.z
        );
    }

    function getIsGrounded() {
        return isGrounded;
    }

    return {
        jump,
        update,
        getIsGrounded,
        velocity,
        settings
    };
}