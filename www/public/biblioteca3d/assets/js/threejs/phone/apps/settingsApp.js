export function createSettingsApp() {
    const app = document.createElement("div");
    app.className = "phone-app settings-app";

    app.innerHTML = `
        <div class="settings-card">
            <h3>Qualidade do jogo</h3>
            <p>Escolha a qualidade visual do mapa e dos efeitos.</p>

            <div class="setting-row">
                <span>Baixa</span>
                <button>Selecionar</button>
            </div>

            <div class="setting-row">
                <span>Média</span>
                <button>Selecionar</button>
            </div>

            <div class="setting-row">
                <span>Alta</span>
                <button>Selecionar</button>
            </div>
        </div>

        <div class="settings-card">
            <h3>Áudio</h3>

            <div class="setting-row">
                <span>Voz</span>
                <button>Ativar</button>
            </div>

            <div class="setting-row">
                <span>Sons do jogo</span>
                <button>Ativar</button>
            </div>
        </div>
    `;

    return app;
}