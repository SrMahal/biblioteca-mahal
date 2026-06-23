import { phoneState } from "./phoneState.js";
import { createSettingsApp } from "./apps/settingsApp.js";

import {
    createMessagesApp,
    focusMessagesInput
} from "./apps/messagesApp.js";

import { createVoiceApp } from "./apps/voiceApp.js";

export function createPhoneUI({
    onOpen = () => { },
    onClose = () => { }
} = {}) {
    let phone = document.getElementById("gamePhone");

    if (!phone) {
        phone = document.createElement("div");
        phone.id = "gamePhone";

        phone.innerHTML = `
            <div class="phone-screen">
                <div class="phone-header">
                    <button id="phoneBack" class="phone-back">‹</button>
                    <strong id="phoneTitle">Biblioteca Phone</strong>
                    <button id="phoneClose">×</button>
                </div>

                <div class="phone-content" id="phoneContent"></div>
            </div>
        `;

        document.body.appendChild(phone);
    }

    const closeButton = phone.querySelector("#phoneClose");
    const backButton = phone.querySelector("#phoneBack");
    const title = phone.querySelector("#phoneTitle");
    const content = phone.querySelector("#phoneContent");

    function renderHome() {
        phoneState.currentApp = "home";
        title.textContent = "Biblioteca Phone";
        backButton.style.visibility = "hidden";

        content.innerHTML = `
            <div class="phone-app-grid">
                <div class="phone-app" data-app="settings">
                    <img src="/biblioteca3d/assets/img/phone/config.png" alt="Config">
                    <span>Config</span>
                </div>

                <div class="phone-app" data-app="contacts">
                    <img src="/biblioteca3d/assets/img/phone/contato.png" alt="Contato">
                    <span>Contato</span>
                </div>

                <div class="phone-app" data-app="messages">
                    <img src="/biblioteca3d/assets/img/phone/mensagens.png" alt="Mensagens">
                    <span>Mensagens</span>
                </div>

                <div class="phone-app" data-app="voice">
                    <img src="/biblioteca3d/assets/img/phone/microfone.png" alt="Voz">
                    <span>Voz</span>
                </div>
            </div>
            
        `;

        content.querySelectorAll(".phone-app").forEach((app) => {
            app.addEventListener("click", () => {
                openApp(app.dataset.app);
            });
        });
    }

    function openApp(appName) {
        phoneState.currentApp = appName;
        content.innerHTML = "";
        backButton.style.visibility = "visible";

        if (appName === "settings") {
            title.textContent = "Configurações";
            content.appendChild(createSettingsApp());
            return;
        }

        if (appName === "messages") {
            title.textContent = "Mensagens";
            content.appendChild(createMessagesApp());
            focusMessagesInput();
            return;
        }

        if (appName === "contacts") {
            title.textContent = "Contatos";
            content.innerHTML = `
                <h3>Contatos</h3>
                <p>Em breve: lista de amigos e jogadores online.</p>
            `;
            return;
        }

        if (appName === "voice") {
            title.textContent = "Voz";
            content.appendChild(createVoiceApp());
            return;
        }

        renderHome();
    }

    function showPhone() {
        phoneState.isOpen = true;
        phone.classList.add("active");
        document.body.classList.add("phone-open");

        if (!phoneState.currentApp || phoneState.currentApp === "home") {
            renderHome();
        }

        onOpen();
    }

    function hidePhone() {
        phoneState.isOpen = false;
        phone.classList.remove("active");
        document.body.classList.remove("phone-open");
        onClose();
    }

    function togglePhone() {
        phoneState.isOpen ? hidePhone() : showPhone();
    }

    function isOpen() {
        return phoneState.isOpen;
    }

    closeButton.onclick = hidePhone;
    backButton.onclick = renderHome;

    renderHome();

    return {
        showPhone,
        hidePhone,
        togglePhone,
        openApp,
        isOpen
    };
}