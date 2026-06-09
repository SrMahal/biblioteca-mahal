console.log("SOCKET CLIENT CARREGOU");

import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

export const socket = io("https://game.mahal.pro", {
    transports: ["websocket"]
});

export function joinWorld(data) {
    socket.emit("join-world", data);
}

export function sendPlayerState(data) {
    socket.emit("player-state", data);
}

socket.on("connect", () => {
    console.log("Conectado ao servidor:", socket.id);
});

socket.on("connected", (data) => {
    console.log("Servidor respondeu:", data);
});