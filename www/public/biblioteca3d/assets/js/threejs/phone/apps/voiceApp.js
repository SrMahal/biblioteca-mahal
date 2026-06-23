import {
    setupVoice,
    stopVoice,
    isVoiceEnabled,
    unlockMobileAudio
} from "../../network/voiceClient.js";

export function createVoiceApp() {
    const app = document.createElement("div");
    app.className = "phone-app settings-app";

    app.innerHTML = `
        <div class="settings-card">
            <h3>Chat de voz</h3>
            <p>Ative ou desative seu microfone no mundo.</p>

            <div class="setting-row">
                <span>Status</span>
                <strong id="voiceStatus">
                    ${isVoiceEnabled() ? "Ativo" : "Desativado"}
                </strong>
            </div>

            <button id="voiceToggleButton" class="phone-main-button">
                ${isVoiceEnabled() ? "Desativar voz" : "Ativar voz"}
            </button>
        </div>
    `;

    const status = app.querySelector("#voiceStatus");
    const button = app.querySelector("#voiceToggleButton");

    button.onclick = async () => {
        console.log("Clique no botão de voz");

        try {
            if (isVoiceEnabled()) {
                stopVoice();

                status.textContent = "Desativado";
                button.textContent = "Ativar voz";

                return;
            }

            if (!window.__voiceContext) {
                console.error("window.__voiceContext não existe");
                alert("Voice context não iniciado.");
                return;
            }

            button.disabled = true;
            button.textContent = "Ativando...";

            await unlockMobileAudio?.();

            await setupVoice({
                camera: window.__voiceContext.camera,
                getRemoteObjectById: window.__voiceContext.getRemoteObjectById,
                getRemotePlayerIds: window.__voiceContext.getRemotePlayerIds
            });

            status.textContent = "Ativo";
            button.textContent = "Desativar voz";
            button.disabled = false;

        } catch (error) {
            console.error("Erro ao ativar voz:", error);

            status.textContent = "Erro";
            button.textContent = "Ativar voz";
            button.disabled = false;

            alert("Erro ao ativar microfone: " + error.message);
        }
    };

    return app;
}