console.log("SOCKET CLIENT CARREGOU");

import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

export const socket = io("https://game.mahal.pro", {
    transports: ["websocket"]
});

export function joinWorld(data) {
    socket.emit("join-world", data);
}

export function sendPlayerInput({
    worldId = "biblioteca-central",
    input
}) {
    socket.emit("player-input", {
        worldId,
        input
    });
}

export function onServerState(callback) {
    socket.on("server-state", callback);
}

export function sendGlobalChatMessage(message) {
    socket.emit("global-chat-message", {
        message
    });
}

export function onGlobalChatMessage(callback) {
    socket.on("global-chat-message", callback);
}

socket.on("connect", () => {
    console.log("Conectado ao servidor:", socket.id);
});

socket.on("world-config", (data) => {
    console.log("Configuração do mundo:", data);
});