export function setupLoadingScreen() {

    function hideLoadingScreen() {
        const loadingScreen =
            document.getElementById("loadingScreen");

        if (!loadingScreen) return;

        loadingScreen.classList.add("hidden");

        setTimeout(() => {
            loadingScreen.remove();
        }, 900);
    }

    if (document.readyState === "complete") {
        setTimeout(hideLoadingScreen, 1200);
        return;
    }

    window.addEventListener("load", () => {
        setTimeout(hideLoadingScreen, 1200);
    });
}