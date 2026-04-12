<?php
$loginCssVersion = is_file(__DIR__ . '/../../../public/assets/css/style.css')
    ? (string)filemtime(__DIR__ . '/../../../public/assets/css/style.css')
    : (string)time();

$loginJsVersion = is_file(__DIR__ . '/../../../public/assets/js/login.js')
    ? (string)filemtime(__DIR__ . '/../../../public/assets/js/login.js')
    : (string)time();
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Studio Mahal</title>
    <link rel="stylesheet" href="/assets/css/style.css?v=<?= $loginCssVersion ?>">
</head>

<body>

    <div class="center-screen">
        <div class="card" style="width: 100%; max-width: 400px; text-align: center;">
            <h1 style="color: var(--orange); margin-bottom: 10px;">STUDIO MAHAL</h1>
            <h3 style="margin-bottom: 30px; font-weight: normal;">Acesso Restrito</h3>

            <form id="loginForm">
                <div style="text-align: left;">
                    <label for="email" style="color: var(--text-secondary);">E-mail</label>
                    <input type="email" id="email" required placeholder="mahal@mahal.pro">
                </div>

                <div style="text-align: left;">
                    <label for="password" style="color: var(--text-secondary);">Senha</label>
                    <input type="password" id="password" required placeholder="******">
                </div>

                <button type="submit">Entrar na Plataforma</button>
            </form>

            <p id="error-msg" style="color: #ff4444; display: none; margin-top: 15px; font-size: 0.9rem;"></p>

            <div style="margin-top: 16px;">
                <a href="/reset" style="color: var(--text-secondary); text-decoration: none; font-size: .9rem;">
                    Esqueci minha senha!
                </a>
            </div>
        </div>

        <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.8rem;">
            &copy; Studio Mahal 2026
        </p>
    </div>

    <script src="/assets/js/login.js?v=<?= $loginJsVersion ?>"></script>
</body>

</html>