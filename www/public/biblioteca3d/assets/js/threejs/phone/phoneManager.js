import { createPhoneUI } from "./phoneUI.js";
import { isTyping } from "../utils/isTyping.js";

let phoneManagerInitialized = false;

export function setupPhone({
    onOpen = () => { },
    onClose = () => { }
} = {}) {
    if (phoneManagerInitialized) {
        return window.__phoneUI;
    }

    phoneManagerInitialized = true;

    const phoneUI = createPhoneUI({
        onOpen,
        onClose
    });

    window.__phoneUI = phoneUI;

    let phoneButton =
        document.getElementById("mobilePhoneButton");

    if (!phoneButton) {
        phoneButton = document.createElement("button");
        phoneButton.id = "mobilePhoneButton";
        phoneButton.textContent = "Celular";
        document.body.appendChild(phoneButton);
    }

    function openPhone() {
        window.__phoneOpening = true;
        document.exitPointerLock?.();

        setTimeout(() => {
            phoneUI.showPhone();
            window.__phoneOpening = false;
        }, 120);
    }

    function closePhone() {
        phoneUI.hidePhone();
    }

    function togglePhone() {
        phoneUI.isOpen()
            ? closePhone()
            : openPhone();
    }

    function openMessages() {
        window.__phoneOpening = true;
        document.exitPointerLock?.();

        setTimeout(() => {
            phoneUI.showPhone();
            phoneUI.openApp("messages");
            window.__phoneOpening = false;
        }, 120);
    }

    window.addEventListener("keydown", (event) => {
        if (isTyping()) return;

        if (event.code === "KeyT") {
            event.preventDefault();
            event.stopPropagation();

            openMessages();
            return;
        }

        if (event.code === "KeyC") {
            event.preventDefault();
            event.stopPropagation();

            togglePhone();
            return;
        }
    }, true);

    phoneButton.onclick = togglePhone;

    console.log("Celular iniciado. Pressione C. Pressione T para mensagens.");

    return phoneUI;
}