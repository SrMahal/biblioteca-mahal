<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Biblioteca Mahal</title>
    <link rel="icon" href="/biblioteca3d/assets/img/logos/logo-biblioteca.png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/biblioteca3d/assets/css/style.css">
    <link rel="stylesheet" href="/biblioteca3d/assets/css/customContextMenu.css">
</head>

<body>

    <div id="loadingScreen">
        <div class="loaderDots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="loaderLogo">Biblioteca Mahal</div>
        <p>Carregando biblioteca...</p>
    </div>

    <input id="mobileTerminalInput" type="text" autocomplete="off" autocorrect="off" autocapitalize="off"
        spellcheck="false" />

    <div id="customContextMenu" class="custom-menu">
        <div class="menu-item" data-link="/biblioteca">📁 Biblioteca</div>
        <div class="menu-item has-submenu">
            📁 Cursos
            <div class="submenu">
                <div class="menu-item" data-link="/curso/php">PHP</div>
                <div class="menu-item" data-link="/curso/js">JavaScript</div>
                <div class="menu-item" data-link="/curso/linux">Linux</div>
            </div>
        </div>
        <div class="menu-item" data-link="/missoes">🚀 Missões</div>
    </div>

    <div id="footerPopup">

        <img src="/biblioteca3d/assets/img/elementos/coruja.png" alt="Coruja" class="popupOwl">

        <div class="footerPopupCard">
            <p>Bem vindo(a) a Versão Beta da biblioteca <br> Construida e versionada pela comunidade.</p>

            <div class="footerPopupButtons">
                <button id="understoodButton">Entendi</button>
                <button><a href="login">Login</a></button>
                <button id="helpButton">Ajudar a construir</button>
            </div>
        </div>

    </div>
    <button id="reopenPopupButton"><i class="fa-solid fa-arrow-right-to-bracket"></i></button>

    <div class="hud">
        <a href="/discord"><i class="fa-brands fa-discord"></i></a>
        <a href="/discord"><i class="fa-solid fa-book"></i></a>
        <a href="/discord"><i class="fa-brands fa-github"></i></a>
        <button id="playButton" class="play-button">
            Play
        </button>
    </div>

    <script type="importmap">
        {
        "imports": {
            "three": "/biblioteca3d/vendor/three/build/three.module.min.js",
            "three/webgpu": "/biblioteca3d/vendor/three/build/three.webgpu.min.js",
            "three/addons/": "/biblioteca3d/vendor/three/examples/jsm/"
        }
        }
    </script>
    <script type="module" src="/biblioteca3d/assets/js/threejs/main.js?v=1"></script>

</body>

</html>