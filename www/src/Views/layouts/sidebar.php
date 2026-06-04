<?php
$appVersion = getenv('APP_VERSION') ?: 'dev';
?>
<aside class="sidebar">
    <div class="logo">
        <h2><i class="fa-solid fa-lines-leaning"></i> Biblioteca <span style="color: #ff6600">Mahal</span></h2>
    </div>

    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333;">
        <span style="color: #a8a8b3; font-size: 0.9rem;">Olá, </span>
        <strong id="user-name" style="color: #fff; display: block; margin-top: 5px; font-size: 1.1rem;">Visitante</strong>
    </div>

    <nav>
        <a href="/home" class="<?= $page == 'home' ? 'active' : '' ?>">🏠 Início</a>
        <a href="/cursos" class="<?= $page === 'cursos' ? 'active' : '' ?>">📚 Biblioteca</a>
        <a href="/missoes" class="<?= $page == 'missoes' ? 'active' : '' ?>">🚀 Missões</a>
        <a href="/game-biblio" class="<?= $page == 'game-biblio' ? 'active' : '' ?>">🚀 The Game</a>
        <a href="/perfil" class="<?= $page == 'perfil' ? 'active' : '' ?>">⚙️ Minha Conta</a>
    </nav>
    <div class="sidebar-version">
        Versão <?= htmlspecialchars($appVersion) ?>
    </div>

</aside>