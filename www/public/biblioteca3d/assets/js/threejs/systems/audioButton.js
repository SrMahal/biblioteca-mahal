import {
    toggleAudio,
    isAudioEnabled
} from "./audioManager.js";

export function setupAudioButton() {
    const button =
        document.getElementById("audioToggleButton");

    if (!button) return;

    function updateButton() {
        button.textContent =
            isAudioEnabled()
                ? "🔇 Desativar som"
                : "🔊 Ativar som";
    }

    button.addEventListener("click", async () => {
        await toggleAudio();
        updateButton();
    });

    updateButton();
}