import { socket } from "./socketClient.js";

import {
    registerAudio,
    unregisterAudio,
    isAudioEnabled
} from "../systems/audioManager.js";

/* =========================
   STATE
========================= */

let voiceOutputEnabled = false;
let microphoneEnabled = false;

let localStream = null;
let audioContext = null;
let analyser = null;
let speakingInterval = null;

let getRemotePlayerIdsRef = null;

const peerConnections = new Map();
const remoteAudios = new Map();

const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

/* =========================
   MOBILE AUDIO UNLOCK
========================= */

export async function unlockMobileAudio() {
    try {
        audioContext =
            audioContext ||
            new (window.AudioContext || window.webkitAudioContext)();

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        console.log("🔓 Audio desbloqueado");
        return true;
    } catch (err) {
        console.warn("Erro unlock áudio:", err);
        return false;
    }
}

/* =========================
   PUBLIC API
========================= */

export function isVoiceEnabled() {
    return microphoneEnabled;
}

export function isVoiceOutputEnabled() {
    return voiceOutputEnabled;
}

export async function enableVoiceOutput({ getRemotePlayerIds } = {}) {
    voiceOutputEnabled = true;

    if (getRemotePlayerIds) {
        getRemotePlayerIdsRef = getRemotePlayerIds;
    }

    const ids = getRemotePlayerIdsRef?.() || [];

    for (const id of ids) {
        await createOffer(id);
    }

    console.log("🔊 Voice output ON");
}

export function disableVoiceOutput() {
    voiceOutputEnabled = false;

    for (const peer of peerConnections.values()) {
        peer.close();
    }

    peerConnections.clear();

    for (const audio of remoteAudios.values()) {
        unregisterAudio(audio);
        audio.muted = true;
    }

    remoteAudios.clear();

    console.log("🔇 Voice output OFF");
}

/* =========================
   MICROPHONE
========================= */

export async function enableMicrophone() {
    if (microphoneEnabled) return;

    // reutiliza stream
    if (localStream) {
        localStream.getAudioTracks().forEach(t => (t.enabled = true));
        microphoneEnabled = true;
        console.log("🎤 Mic reativado");
        return;
    }

    localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        }
    });

    microphoneEnabled = true;

    startSpeakingDetection(localStream);

    for (const peer of peerConnections.values()) {
        addLocalTracksToPeer(peer);
    }

    for (const id of peerConnections.keys()) {
        await createOffer(id);
    }

    console.log("🎤 Mic ON");
}

export function disableMicrophone() {
    microphoneEnabled = false;

    if (localStream) {
        localStream.getAudioTracks().forEach(t => (t.enabled = false));
    }

    window.dispatchEvent(
        new CustomEvent("voice-speaking", {
            detail: {
                playerId: socket.id,
                speaking: false,
                local: true
            }
        })
    );

    console.log("🎤 Mic OFF (mutado)");
}

export async function setupVoice(options = {}) {
    await unlockMobileAudio(); // 🔥 garante mobile
    await enableVoiceOutput(options);
    await enableMicrophone();
}

export function stopVoice() {
    disableMicrophone();
}

/* =========================
   PEER CONNECTION
========================= */

function shouldCreateOffer(targetId) {
    return socket.id < targetId;
}

function createPeerConnection(targetId) {
    if (peerConnections.has(targetId)) {
        return peerConnections.get(targetId);
    }

    const peer = new RTCPeerConnection(rtcConfig);

    peerConnections.set(targetId, peer);

    peer.addTransceiver("audio", {
        direction: localStream ? "sendrecv" : "recvonly"
    });

    addLocalTracksToPeer(peer);

    peer.onicecandidate = (event) => {
        if (!event.candidate) return;

        socket.emit("voice-ice-candidate", {
            targetId,
            candidate: event.candidate
        });
    };

    peer.ontrack = (event) => {
        let audio = remoteAudios.get(targetId);

        if (!audio) {
            audio = document.createElement("audio");

            audio.autoplay = true;
            audio.playsInline = true;
            audio.setAttribute("playsinline", "true");
            audio.setAttribute("webkit-playsinline", "true");

            audio.muted = !isAudioEnabled();
            audio.style.display = "none";

            document.body.appendChild(audio);
            registerAudio(audio);

            remoteAudios.set(targetId, audio);
        }

        if (audio.srcObject !== event.streams[0]) {
            audio.srcObject = event.streams[0];
        }

        audio.muted = !isAudioEnabled();

        // 🔥 tentativa imediata (melhor pro mobile)
        if (isAudioEnabled()) {
            audio.play().catch(() => {});
        }
    };

    peer.onconnectionstatechange = () => {
        if (
            peer.connectionState === "failed" ||
            peer.connectionState === "closed"
        ) {
            cleanupPeer(targetId);
        }
    };

    return peer;
}

function addLocalTracksToPeer(peer) {
    if (!localStream) return;

    const existing = peer.getSenders().map(s => s.track);

    localStream.getTracks().forEach(track => {
        if (!existing.includes(track)) {
            peer.addTrack(track, localStream);
        }
    });
}

/* =========================
   SIGNALING
========================= */

async function createOffer(targetId) {
    if (!voiceOutputEnabled && !microphoneEnabled) return;
    if (!targetId || targetId === socket.id) return;
    if (!shouldCreateOffer(targetId)) return;

    const peer = createPeerConnection(targetId);

    if (peer.signalingState !== "stable") return;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("voice-offer", {
        targetId,
        offer
    });
}

async function handleOffer({ fromId, offer }) {
    if (!voiceOutputEnabled && !microphoneEnabled) return;

    const peer = createPeerConnection(fromId);

    if (peer.signalingState !== "stable") {
        cleanupPeer(fromId);
        return handleOffer({ fromId, offer });
    }

    await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
    );

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("voice-answer", {
        targetId: fromId,
        answer
    });
}

async function handleAnswer({ fromId, answer }) {
    const peer = peerConnections.get(fromId);
    if (!peer) return;

    if (peer.signalingState !== "have-local-offer") return;

    await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
    );
}

async function handleIceCandidate({ fromId, candidate }) {
    const peer = peerConnections.get(fromId);
    if (!peer || !candidate) return;

    try {
        await peer.addIceCandidate(
            new RTCIceCandidate(candidate)
        );
    } catch {}
}

/* =========================
   CLEANUP
========================= */

function cleanupPeer(targetId) {
    const peer = peerConnections.get(targetId);

    if (peer) {
        peer.close();
        peerConnections.delete(targetId);
    }

    const audio = remoteAudios.get(targetId);

    if (audio) {
        unregisterAudio(audio);
        audio.muted = true;
        remoteAudios.delete(targetId);
    }
}

/* =========================
   SPEAKING DETECTION
========================= */

function startSpeakingDetection(stream) {
    if (speakingInterval) return;

    audioContext =
        audioContext ||
        new (window.AudioContext || window.webkitAudioContext)();

    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    speakingInterval = setInterval(() => {
        analyser.getByteFrequencyData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];

        const speaking = sum / data.length > 12;

        window.dispatchEvent(
            new CustomEvent("voice-speaking", {
                detail: {
                    playerId: socket.id,
                    local: true,
                    speaking
                }
            })
        );

        socket.emit("voice-speaking", { speaking });
    }, 120);
}

/* =========================
   SOCKET EVENTS
========================= */

socket.on("voice-offer", handleOffer);
socket.on("voice-answer", handleAnswer);
socket.on("voice-ice-candidate", handleIceCandidate);

socket.on("player-left", (data) => {
    cleanupPeer(data.id);
});

window.addEventListener("remote-player-added", (event) => {
    const id = event.detail?.id;

    if (!id || id === socket.id) return;

    if (voiceOutputEnabled || microphoneEnabled) {
        createOffer(id);
    }
});