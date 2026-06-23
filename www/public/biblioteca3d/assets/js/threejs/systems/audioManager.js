let audioEnabled = false;
let audioContext = null;

const registeredAudios = new Set();

export function isAudioEnabled() {
    return audioEnabled;
}

export async function enableAudio() {
    audioEnabled = true;

    audioContext =
        audioContext ||
        new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }

    for (const audio of registeredAudios) {
        audio.muted = false;
        audio.volume = 1;

        audio.play?.().catch(() => {});
    }

    document.body.classList.add("audio-enabled");

    console.log("Som ativado");
}

export function disableAudio() {
    audioEnabled = false;

    for (const audio of registeredAudios) {
        audio.muted = true;
        audio.pause?.();
    }

    document.body.classList.remove("audio-enabled");

    console.log("Som desativado");
}

export function toggleAudio() {
    if (audioEnabled) {
        disableAudio();
    } else {
        enableAudio();
    }
}

export function registerAudio(audio) {
    if (!audio) return;

    registeredAudios.add(audio);

    audio.muted = !audioEnabled;

    if (audioEnabled) {
        audio.play?.().catch(() => {});
    }
}

export function unregisterAudio(audio) {
    if (!audio) return;

    registeredAudios.delete(audio);
}

export function getAudioContext() {
    return audioContext;
}