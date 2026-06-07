import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createControls({
    renderer,
    camera,
    cameraSettings,
    cameraTarget,
    getCameraDistance,
    setCameraDistance,
}) {
    let enabled = true;

    const controlsState = {
        isDragging: false,
        lastPointerX: 0,
        lastPointerY: 0,
        lastPinchDistance: null,
        isPinching: false,
        blockDragUntilAllFingersUp: false,
        activePointers: new Map(),
    };

    function setEnabled(value) {
        enabled = value;

        if (!enabled) {
            controlsState.isDragging = false;
            controlsState.isPinching = false;
            controlsState.activePointers.clear();
        }
    }

    function updateCameraPosition() {
        const cameraDistance = getCameraDistance();

        const zOffsetRatio =
            cameraSettings.tiltZ / cameraSettings.distance;

        camera.position.set(
            cameraTarget.x,
            cameraDistance,
            cameraTarget.z + cameraDistance * zOffsetRatio
        );

        camera.lookAt(cameraTarget);
    }

    function screenDragToWorldMove(deltaX, deltaY) {
        const cameraDistance = getCameraDistance();
        const moveSpeed = cameraDistance * 0.0012;

        cameraTarget.x -= deltaX * moveSpeed;
        cameraTarget.z -= deltaY * moveSpeed;

        updateCameraPosition();
    }

    function setCameraZoom(deltaDistance) {
        const cameraDistance = getCameraDistance();

        const newDistance = THREE.MathUtils.clamp(
            cameraDistance + deltaDistance,
            cameraSettings.minDistance,
            cameraSettings.maxDistance
        );

        setCameraDistance(newDistance);
        updateCameraPosition();
    }

    function getPointerDistance() {
        const pointers = [...controlsState.activePointers.values()];
        if (pointers.length < 2) return null;

        const dx = pointers[0].x - pointers[1].x;
        const dy = pointers[0].y - pointers[1].y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    function finishPointer(event) {
        controlsState.activePointers.delete(event.pointerId);

        if (controlsState.activePointers.size === 0) {
            controlsState.isDragging = false;
            controlsState.isPinching = false;
            controlsState.blockDragUntilAllFingersUp = false;
            controlsState.lastPinchDistance = null;
            return;
        }

        if (controlsState.activePointers.size === 1) {
            controlsState.isDragging = false;
            controlsState.isPinching = false;
            controlsState.lastPinchDistance = null;
        }
    }

    renderer.domElement.addEventListener('pointerdown', (event) => {
        if (!enabled) return;

        event.preventDefault();

        controlsState.activePointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

        renderer.domElement.setPointerCapture(event.pointerId);

        if (
            controlsState.activePointers.size === 1 &&
            !controlsState.blockDragUntilAllFingersUp
        ) {
            controlsState.isDragging = true;
            controlsState.isPinching = false;
            controlsState.lastPointerX = event.clientX;
            controlsState.lastPointerY = event.clientY;
        }

        if (controlsState.activePointers.size >= 2) {
            controlsState.isDragging = false;
            controlsState.isPinching = true;
            controlsState.blockDragUntilAllFingersUp = true;
            controlsState.lastPinchDistance = getPointerDistance();
        }
    });

    renderer.domElement.addEventListener('pointermove', (event) => {
        if (!enabled) return;

        event.preventDefault();

        if (!controlsState.activePointers.has(event.pointerId)) return;

        controlsState.activePointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

        if (controlsState.isPinching && controlsState.activePointers.size >= 2) {
            const currentDistance = getPointerDistance();

            if (controlsState.lastPinchDistance !== null) {
                const pinchDelta =
                    currentDistance - controlsState.lastPinchDistance;

                setCameraZoom(-pinchDelta * 0.08);
            }

            controlsState.lastPinchDistance = currentDistance;
            return;
        }

        if (!controlsState.isDragging) return;

        const deltaX = event.clientX - controlsState.lastPointerX;
        const deltaY = event.clientY - controlsState.lastPointerY;

        screenDragToWorldMove(deltaX, deltaY);

        controlsState.lastPointerX = event.clientX;
        controlsState.lastPointerY = event.clientY;
    });

    renderer.domElement.addEventListener('pointerup', (event) => {
        if (!enabled) return;

        finishPointer(event);

        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
            renderer.domElement.releasePointerCapture(event.pointerId);
        }
    });

    renderer.domElement.addEventListener('pointercancel', (event) => {
        if (!enabled) return;
        finishPointer(event);
    });

    renderer.domElement.addEventListener(
        'wheel',
        (event) => {
            if (!enabled) return;

            event.preventDefault();

            const zoomIntensity = 0.035;
            setCameraZoom(event.deltaY * zoomIntensity);
        },
        { passive: false }
    );

    return {
        setEnabled
    };
}