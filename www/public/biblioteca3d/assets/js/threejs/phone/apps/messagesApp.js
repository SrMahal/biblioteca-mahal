import {
    sendGlobalChatMessage,
    onGlobalChatMessage
} from "../../network/socketClient.js";

const messages = [];

let appRoot = null;
let messagesList = null;
let input = null;

function renderMessages() {
    if (!messagesList) return;

    messagesList.innerHTML = "";

    messages.forEach((item) => {
        const message = document.createElement("div");
        message.className = "message-bubble";

        message.innerHTML = `
            <strong>${item.name}</strong>
            <span>${item.message}</span>
        `;

        messagesList.appendChild(message);
    });

    messagesList.scrollTop =
        messagesList.scrollHeight;
}

export function createMessagesApp() {
    appRoot = document.createElement("div");
    appRoot.className = "phone-app messages-app";

    appRoot.innerHTML = `
        <div class="messages-list" id="messagesList"></div>

        <form class="messages-form" id="messagesForm">
            <input
                id="messagesInput"
                type="text"
                placeholder="Mensagem global..."
                maxlength="180"
            />
            <button type="submit">Enviar</button>
        </form>
    `;

    messagesList =
        appRoot.querySelector("#messagesList");

    input =
        appRoot.querySelector("#messagesInput");

    const form =
        appRoot.querySelector("#messagesForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const text = input.value.trim();

        if (!text) return;

        sendGlobalChatMessage(text);

        input.value = "";
        input.focus();
    });

    setTimeout(() => {
        input.focus();
    }, 100);

    renderMessages();

    return appRoot;
}

export function focusMessagesInput() {
    if (input) {
        setTimeout(() => input.focus(), 100);
    }
}

onGlobalChatMessage((data) => {
    messages.push(data);

    if (messages.length > 80) {
        messages.shift();
    }

    renderMessages();

    window.dispatchEvent(
        new CustomEvent("global-chat-popup", {
            detail: data
        })
    );
});