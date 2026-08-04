<?php
$assetVersion = static function (string $publicPath): string {
    $cleanPath = strtok($publicPath, '?') ?: $publicPath;
    $fullPath = __DIR__ . '/../../../public' . $cleanPath;

    if (is_file($fullPath)) {
        return (string)filemtime($fullPath);
    }

    return (string)time();
};
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($titulo ?? 'Biblioteca Mahal', ENT_QUOTES, 'UTF-8') ?></title>

    <link rel="shortcut icon" href="/assets/img/logos/logo-bilbioteca.png" type="image/x-icon">
    <link rel="stylesheet" href="/assets/css/main.css?v=<?= $assetVersion('/assets/css/main.css') ?>">

    <?php foreach (($extraCss ?? []) as $cssFile): ?>
        <link rel="stylesheet" href="<?= htmlspecialchars($cssFile, ENT_QUOTES, 'UTF-8') ?><?= str_contains($cssFile, '?') ? '&' : '?' ?>v=<?= $assetVersion($cssFile) ?>">
    <?php endforeach; ?>

    <?php include 'assets/pag/home/components/head.php'; ?>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">


    <script>
        window.MAHAL_API_BASE = window.location.origin;
    </script>

    <script src="/assets/js/auth.js?v=<?= $assetVersion('/assets/js/auth.js') ?>"></script>
    <script src="/assets/js/sidebar.js?v=<?= $assetVersion('/assets/js/sidebar.js') ?>"></script>
</head>

<body>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <div class="app-container">
        <?php require __DIR__ . '/sidebar.php'; ?>

        <main class="main-content">
            <header class="topbar">
                <button class="btn-sidebar-toggle" id="sidebarToggle" type="button" aria-label="Abrir menu">
                    ☰ Menu
                </button>
                <button onclick="logout()" class="btn-logout"> Sair </button>
                <button onclick="logout()" class="btn-logout"> ✕ </button>
            </header>

            <?php require __DIR__ . '/header.php'; ?>

            <div class="content-body">
                <?php require $viewPath; ?>
                <footer class="footer">
                    <p>&copy; <?= date('Y') ?> @Mahal.exe - Todos os direitos reservados.</p>
                </footer>
            </div>

        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const user = JSON.parse(localStorage.getItem('mahal_user') || 'null');
            if (user && user.nome) {
                const el = document.getElementById('user-name');
                if (el) el.innerText = user.nome;
            }
        });
    </script>

    <?php foreach (($extraJs ?? []) as $jsFile): ?>
        <script src="<?= htmlspecialchars($jsFile, ENT_QUOTES, 'UTF-8') ?><?= str_contains($jsFile, '?') ? '&' : '?' ?>v=<?= $assetVersion($jsFile) ?>"></script>
    <?php endforeach; ?>
</body>

</html>