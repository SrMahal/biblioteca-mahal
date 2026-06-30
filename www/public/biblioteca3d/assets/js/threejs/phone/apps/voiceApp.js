import {
    enableMicrophone,
    disableMicrophone,
    isVoiceEnabled,
    unlockMobileAudio
} from "../../network/voiceClient.js";

export function createVoiceApp() {
    const app = document.createElement("div");
    app.className = "phone-app settings-app";

    app.innerHTML = `
        <div class="settings-card">
            <h3>Microfone</h3>
            <p>Ative ou desative seu microfone no mundo.</p>

            <div class="setting-row">
                <span>Status</span>
                <strong id="voiceStatus">
                    ${isVoiceEnabled() ? "Ativo" : "Desativado"}
                </strong>
            </div>

            <button id="voiceToggleButton" class="phone-main-button">
                ${isVoiceEnabled() ? "Desativar microfone" : "Ativar microfone"}
            </button>
        </div>
    `;

    const status = app.querySelector("#voiceStatus");
    const button = app.querySelector("#voiceToggleButton");

    button.onclick = async () => {
        try {
            if (isVoiceEnabled()) {
                disableMicrophone();

                status.textContent = "Desativado";
                button.textContent = "Ativar microfone";

                return;
            }

            button.disabled = true;
            button.textContent = "Ativando...";

            await unlockMobileAudio();

            await enableMicrophone();

            status.textContent = "Ativo";
            button.textContent = "Desativar microfone";
            button.disabled = false;

        } catch (error) {
            console.error("Erro ao ativar microfone:", error);

            status.textContent = "Erro";
            button.textContent = "Ativar microfone";
            button.disabled = false;

            alert("Erro ao ativar microfone: " + error.message);
        }
    };

    return app;
}