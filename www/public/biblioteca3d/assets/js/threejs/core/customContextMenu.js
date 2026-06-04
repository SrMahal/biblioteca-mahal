export function createCustomContextMenu() {
    return new THREE.Scene();
    const menu = document.getElementById("customContextMenu");

    window.addEventListener("contextmenu", (event) => {
        event.preventDefault();

        menu.style.display = "block";
        menu.style.left = event.clientX + "px";
        menu.style.top = event.clientY + "px";
    });

    window.addEventListener("click", () => {
        menu.style.display = "none";
    });

    document.querySelectorAll(".menu-item[data-link]").forEach((item) => {
        item.addEventListener("click", () => {
            window.location.href = item.dataset.link;
        });
    });
}

