export function setupLoadingScreen() {

    function hideLoadingScreen() {

        const loadingScreen =
            document.getElementById(
                "loadingScreen"
            );

        loadingScreen.classList
            .add("hidden");

        setTimeout(() => {

            loadingScreen.remove();

        }, 900);
    }

    window.addEventListener(
        "load",
        () => {

            setTimeout(
                hideLoadingScreen,
                1200
            );

        }
    );
}