import { socket } from "./socketClient.js";
import {
    registerAudio,
    unregisterAudio,
    isAudioEnabled
} from "../systems/audioManager.js";

let voiceEnabled = false;
let localStream = null;

let audioContext = null;
let analyser = null;
let speakingInterval = null;

let getRemoteObjectByIdRef = null;
let getRemotePlayerIdsRef = null;

const peerConnections = new Map();
const remoteAudios = new Map();

const rtcConfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

export function isVoiceEnabled() {
    return voiceEnabled;
}

export async function setupVoice({
    camera,
    getRemoteObjectById,
    getRemotePlayerIds
}) {
    if (voiceEnabled) return;

    getRemoteObjectByIdRef = getRemoteObjectById;
    getRemotePlayerIdsRef = getRemotePlayerIds;

    localStream =
        await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

    voiceEnabled = true;

    startSpeakingDetection(localStream);

    const remoteIds =
        getRemotePlayerIdsRef?.() || [];

    remoteIds.forEach((remoteId) => {
        createOffer(remoteId);
    });

    console.log("Microfone ativado");
}

export function stopVoice() {
    voiceEnabled = false;

    if (speakingInterval) {
        clearInterval(speakingInterval);
        speakingInterval = null;
    }

    if (audioContext) {
        audioContext.close?.();
        audioContext = null;
    }

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });

        localStream = null;
    }

    for (const peer of peerConnections.values()) {
        peer.close();
    }

    peerConnections.clear();

    for (const audio of remoteAudios.values()) {
        audio.pause();
        audio.srcObject = null;
        audio.remove();
    }

    remoteAudios.clear();

    window.dispatchEvent(
        new CustomEvent("voice-speaking", {
            detail: {
                playerId: socket.id,
                speaking: false,
                local: true
            }
        })
    );

    console.log("Microfone desativado");
}

function createPeerConnection(targetId) {
    if (peerConnections.has(targetId)) {
        return peerConnections.get(targetId);
    }

    const peer = new RTCPeerConnection(rtcConfig);

    peerConnections.set(targetId, peer);

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            peer.addTrack(track, localStream);
        });
    }

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
            audio.controls = false;
            audio.muted = !isAudioEnabled();
            audio.volume = 1;
            audio.style.display = "none";

            document.body.appendChild(audio);

            registerAudio(audio);

            remoteAudios.set(targetId, audio);
        }

        audio.srcObject = event.streams[0];
        audio.muted = !isAudioEnabled();

        if (isAudioEnabled()) {
            audio.play().catch((error) => {
                console.warn("audio.play bloqueado:", error);
            });
        }
    };

    peer.onconnectionstatechange = () => {
        console.log(
            "Voice connection",
            targetId,
            peer.connectionState
        );

        if (
            peer.connectionState === "failed" ||
            peer.connectionState === "disconnected" ||
            peer.connectionState === "closed"
        ) {
            cleanupPeer(targetId);
        }
    };

    return peer;
}

async function createOffer(targetId) {
    if (!voiceEnabled) return;
    if (!targetId) return;
    if (targetId === socket.id) return;

    const peer =
        createPeerConnection(targetId);

    const offer =
        await peer.createOffer();

    await peer.setLocalDescription(offer);

    socket.emit("voice-offer", {
        targetId,
        offer
    });
}

async function handleOffer({
    fromId,
    offer
}) {
    if (!voiceEnabled) return;

    const peer =
        createPeerConnection(fromId);

    await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
    );

    const answer =
        await peer.createAnswer();

    await peer.setLocalDescription(answer);

    socket.emit("voice-answer", {
        targetId: fromId,
        answer
    });
}

async function handleAnswer({
    fromId,
    answer
}) {
    const peer =
        peerConnections.get(fromId);

    if (!peer) return;

    await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
    );
}

async function handleIceCandidate({
    fromId,
    candidate
}) {
    const peer =
        peerConnections.get(fromId);

    if (!peer) return;
    if (!candidate) return;

    try {
        await peer.addIceCandidate(
            new RTCIceCandidate(candidate)
        );
    } catch (error) {
        console.warn("Erro ICE:", error);
    }
}

function cleanupPeer(targetId) {
    const peer =
        peerConnections.get(targetId);

    if (peer) {
        peer.close();
        peerConnections.delete(targetId);
    }

    const audio =
        remoteAudios.get(targetId);

    if (audio) {
        unregisterAudio(audio);
        audio.pause();
        audio.srcObject = null;
        audio.remove();

        remoteAudios.delete(targetId);
    }
}

function startSpeakingDetection(stream) {
    audioContext =
        new AudioContext();

    const source =
        audioContext.createMediaStreamSource(stream);

    analyser =
        audioContext.createAnalyser();

    analyser.fftSize = 512;

    source.connect(analyser);

    const dataArray =
        new Uint8Array(
            analyser.frequencyBinCount
        );

    speakingInterval = setInterval(() => {
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;

        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }

        const average =
            sum / dataArray.length;

        const speaking =
            average > 12;

        window.dispatchEvent(
            new CustomEvent("voice-speaking", {
                detail: {
                    playerId: socket.id,
                    local: true,
                    speaking
                }
            })
        );

        socket.emit("voice-speaking", {
            speaking
        });
    }, 120);
}

socket.on("voice-offer", (data) => {
    handleOffer(data);
});

socket.on("voice-answer", (data) => {
    handleAnswer(data);
});

socket.on("voice-ice-candidate", (data) => {
    handleIceCandidate(data);
});

socket.on("player-left", (data) => {
    cleanupPeer(data.id);
});

let audioUnlocked = false;
let unlockAudioContext = null;

export async function unlockMobileAudio() {
    if (audioUnlocked) return true;

    try {
        unlockAudioContext =
            unlockAudioContext ||
            new (window.AudioContext || window.webkitAudioContext)();

        if (unlockAudioContext.state === "suspended") {
            await unlockAudioContext.resume();
        }

        audioUnlocked = true;
        console.log("Áudio desbloqueado");
        return true;

    } catch (error) {
        console.warn("Falha ao desbloquear áudio:", error);
        return false;
    }
}