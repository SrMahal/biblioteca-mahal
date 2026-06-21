export function createGlobalChatApp() {
    const app = document.createElement("div");
    app.className = "phone-app";

    app.innerHTML = `
        <h3>Chat Global</h3>

        <div class="phone-chat-messages" id="phoneChatMessages">
            <div class="phone-message">Sistema: Bem-vindo ao chat global.</div>
        </div>

        <div class="phone-chat-input">
            <input id="phoneChatInput" placeholder="Digite uma mensagem..." />
            <button id="phoneChatSend">Enviar</button>
        </div>
    `;

    const input = app.querySelector("#phoneChatInput");
    const button = app.querySelector("#phoneChatSend");
    const messages = app.querySelector("#phoneChatMessages");

    button.addEventListener("click", () => {
        const text = input.value.trim();

        if (!text) return;

        const message = document.createElement("div");
        message.className = "phone-message";
        message.textContent = `Você: ${text}`;

        messages.appendChild(message);
        input.value = "";
        messages.scrollTop = messages.scrollHeight;
    });

    return app;
}