export function setupPopup() {
    const footerPopup = document.getElementById("footerPopup");
    const understoodButton = document.getElementById("understoodButton");
    const reopenPopupButton = document.getElementById("reopenPopupButton");
    const helpButton = document.getElementById("helpButton");

    window.addEventListener("load", () => {
        setTimeout(() => {
            footerPopup.classList.add("show");
        }, 5000);
    });

    understoodButton.addEventListener("click", () => {
        footerPopup.classList.remove("show");
        footerPopup.classList.add("hide");

        setTimeout(() => {
            reopenPopupButton.style.display = "block";
        }, 500);
    });

    reopenPopupButton.addEventListener("click", () => {
        footerPopup.classList.remove("hide");
        footerPopup.classList.add("show");

        reopenPopupButton.style.display = "none";
    });

    helpButton.addEventListener("click", () => {
        window.open("https://biblioteca.mahal.pro/apresentacao", "_blank");
    });
}