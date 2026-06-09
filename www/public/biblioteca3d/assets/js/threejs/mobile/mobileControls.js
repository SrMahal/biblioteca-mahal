export const mobileInput = {
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
    active: false
};

let controlsEnabled = false;

export function isMobileDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
}

export function setupMobileControls() {
    if (!isMobileDevice()) {
        return;
    }

    if (document.getElementById("mobileJoystick")) {
        return;
    }

    const joystick = document.createElement("div");
    joystick.id = "mobileJoystick";

    const knob = document.createElement("div");
    knob.id = "mobileJoystickKnob";

    joystick.appendChild(knob);
    document.body.appendChild(joystick);

    joystick.style.cssText = `
        display: none;
        position: fixed;
        left: 35px;
        bottom: 35px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(255,255,255,0.12);
        border: 2px solid rgba(255,255,255,0.25);
        z-index: 9999;
        touch-action: none;
    `;

    knob.style.cssText = `
        position: absolute;
        left: 40px;
        top: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,153,0,0.9);
    `;

    let joystickTouchId = null;
    let lookTouchId = null;
    let startX = 0;
    let startY = 0;
    let lastLookX = 0;
    let lastLookY = 0;

    window.addEventListener("touchstart", (event) => {
        if (!controlsEnabled) return;

        for (const touch of event.changedTouches) {
            if (
                touch.clientX < window.innerWidth / 2 &&
                joystickTouchId === null
            ) {
                joystickTouchId = touch.identifier;
                startX = touch.clientX;
                startY = touch.clientY;
            } else if (
                touch.clientX >= window.innerWidth / 2 &&
                lookTouchId === null
            ) {
                lookTouchId = touch.identifier;
                lastLookX = touch.clientX;
                lastLookY = touch.clientY;
            }
        }
    }, { passive: false });

    window.addEventListener("touchmove", (event) => {
        if (!controlsEnabled) return;

        for (const touch of event.changedTouches) {
            if (touch.identifier === joystickTouchId) {
                event.preventDefault();

                const dx = touch.clientX - startX;
                const dy = touch.clientY - startY;

                const max = 50;
                const length = Math.min(Math.hypot(dx, dy), max);
                const angle = Math.atan2(dy, dx);

                const x = Math.cos(angle) * length;
                const y = Math.sin(angle) * length;

                knob.style.transform = `translate(${x}px, ${y}px)`;

                mobileInput.moveX = x / max;
                mobileInput.moveY = y / max;
                mobileInput.active = true;
            }

            if (touch.identifier === lookTouchId) {
                event.preventDefault();

                mobileInput.lookX += touch.clientX - lastLookX;
                mobileInput.lookY += touch.clientY - lastLookY;

                lastLookX = touch.clientX;
                lastLookY = touch.clientY;
            }
        }
    }, { passive: false });

    window.addEventListener("touchend", resetTouch, { passive: false });
    window.addEventListener("touchcancel", resetTouch, { passive: false });

    function resetTouch(event) {
        if (!controlsEnabled) return;

        for (const touch of event.changedTouches) {
            if (touch.identifier === joystickTouchId) {
                joystickTouchId = null;
                mobileInput.moveX = 0;
                mobileInput.moveY = 0;
                mobileInput.active = false;
                knob.style.transform = "translate(0, 0)";
            }

            if (touch.identifier === lookTouchId) {
                lookTouchId = null;
                mobileInput.lookX = 0;
                mobileInput.lookY = 0;
            }
        }
    }
}

export function showMobileControls() {
    if (!isMobileDevice()) return;

    controlsEnabled = true;

    const joystick = document.getElementById("mobileJoystick");

    if (joystick) {
        joystick.style.display = "block";
    }
}

export function hideMobileControls() {
    controlsEnabled = false;

    const joystick = document.getElementById("mobileJoystick");

    if (joystick) {
        joystick.style.display = "none";
    }

    mobileInput.moveX = 0;
    mobileInput.moveY = 0;
    mobileInput.lookX = 0;
    mobileInput.lookY = 0;
    mobileInput.active = false;

    const knob = document.getElementById("mobileJoystickKnob");

    if (knob) {
        knob.style.transform = "translate(0, 0)";
    }
}