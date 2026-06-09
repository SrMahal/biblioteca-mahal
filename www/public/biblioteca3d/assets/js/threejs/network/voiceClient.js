import * as THREE from "three";
import { socket } from "./socketClient.js";

let listener = null;
let localStream = null;
let savedGetRemoteObjectById = null;
let voiceInitialized = false;

const peerConnections = new Map();
const remoteAudios = new Map();

const iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

export async function setupVoice({
    camera,
    getRemoteObjectById
}) {
    if (voiceInitialized) return;

    voiceInitialized = true;
    savedGetRemoteObjectById = getRemoteObjectById;

    listener = new THREE.AudioListener();
    camera.add(listener);

    await listener.context.resume();

    localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        },
        video: false
    });

    console.log("Microfone ativado");

    socket.on("current-players", async (players) => {
        console.log("Jogadores já na sala:", players);

        for (const player of players) {
            await createOffer(player.id);
        }
    });

    socket.on("player-joined", async (data) => {
        console.log("Novo jogador para voice:", data.id);
        await createOffer(data.id);
    });

    socket.on("voice-offer", async (data) => {
        if (data.fromId === socket.id) return;

        console.log("Recebi voice offer de:", data.fromId);

        const pc = createPeerConnection(data.fromId);

        addLocalTracks(pc);

        await pc.setRemoteDescription(
            new RTCSessionDescription(data.offer)
        );

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("voice-answer", {
            targetId: data.fromId,
            answer
        });
    });

    socket.on("voice-answer", async (data) => {
        console.log("Recebi voice answer de:", data.fromId);

        const pc = peerConnections.get(data.fromId);

        if (!pc) return;

        await pc.setRemoteDescription(
            new RTCSessionDescription(data.answer)
        );
    });

    socket.on("voice-ice-candidate", async (data) => {
        const pc = peerConnections.get(data.fromId);

        if (!pc || !data.candidate) return;

        await pc.addIceCandidate(
            new RTCIceCandidate(data.candidate)
        );
    });

    socket.on("player-left", (data) => {
        closeVoiceConnection(data.id);
    });
}

async function createOffer(targetId) {
    if (!targetId) return;
    if (targetId === socket.id) return;
    if (peerConnections.has(targetId)) return;
    if (!localStream) return;

    console.log("Criando voice offer para:", targetId);

    const pc = createPeerConnection(targetId);

    addLocalTracks(pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("voice-offer", {
        targetId,
        offer
    });
}

function createPeerConnection(remoteId) {
    if (peerConnections.has(remoteId)) {
        return peerConnections.get(remoteId);
    }

    const pc = new RTCPeerConnection(iceServers);

    peerConnections.set(remoteId, pc);

    pc.onicecandidate = (event) => {
        if (!event.candidate) return;

        socket.emit("voice-ice-candidate", {
            targetId: remoteId,
            candidate: event.candidate
        });
    };

    pc.ontrack = (event) => {
        console.log("Recebi áudio de:", remoteId);

        const remoteStream = event.streams[0];

        const audio = new THREE.PositionalAudio(listener);
        audio.setMediaStreamSource(remoteStream);

        audio.setRefDistance(4);
        audio.setMaxDistance(25);
        audio.setRolloffFactor(2.5);
        audio.setDistanceModel("inverse");

        const remoteObject =
            savedGetRemoteObjectById?.(remoteId);

        if (remoteObject) {
            remoteObject.add(audio);
            console.log("Áudio preso no avatar:", remoteId);
        } else {
            console.warn("Avatar remoto ainda não existe:", remoteId);
        }

        remoteAudios.set(remoteId, audio);
    };

    pc.onconnectionstatechange = () => {
        console.log(
            "Voice connection",
            remoteId,
            pc.connectionState
        );

        if (
            pc.connectionState === "failed" ||
            pc.connectionState === "disconnected" ||
            pc.connectionState === "closed"
        ) {
            closeVoiceConnection(remoteId);
        }
    };

    return pc;
}

function addLocalTracks(pc) {
    if (!localStream) return;

    const alreadyAdded =
        pc.getSenders().some((sender) => sender.track);

    if (alreadyAdded) return;

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });
}

function closeVoiceConnection(remoteId) {
    const pc = peerConnections.get(remoteId);

    if (pc) {
        pc.close();
        peerConnections.delete(remoteId);
    }

    const audio = remoteAudios.get(remoteId);

    if (audio) {
        audio.parent?.remove(audio);
        remoteAudios.delete(remoteId);
    }
}