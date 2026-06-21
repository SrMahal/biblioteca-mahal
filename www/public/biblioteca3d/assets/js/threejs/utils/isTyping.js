export function isTyping() {
    const active = document.activeElement;

    if (!active) return false;

    return (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable
    );
}