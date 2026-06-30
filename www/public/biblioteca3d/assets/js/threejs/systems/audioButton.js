import {
    toggleAudio,
    isAudioEnabled
} from "./audioManager.js";

import {
    unlockMobileAudio,
    enableVoiceOutput,
    disableVoiceOutput
} from "../network/voiceClient.js";

export function setupAudioButton() {
    const button =
        document.getElementById("audioToggleButton");

    if (!button) return;

    function updateButton() {
        button.textContent =
            isAudioEnabled()
                ? "🔇"
                : "🔊 Ativar som";
    }

    button.addEventListener("click", async () => {
        await unlockMobileAudio();

        await toggleAudio();

        if (isAudioEnabled()) {
            await enableVoiceOutput({
                getRemotePlayerIds:
                    window.__voiceContext?.getRemotePlayerIds
            });
        } else {
            disableVoiceOutput();
        }

        updateButton();
    });

    updateButton();
}