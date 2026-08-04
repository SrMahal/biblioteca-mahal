<aside class="sidebar">
    <div class="logo">
        <h2><i class="fa-solid fa-lines-leaning"></i> Biblioteca <span style="color: #ff6600">Mahal</span></h2>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333;">
        <span style="color: #a8a8b3; font-size: 0.9rem;">Olá, </span>
        <strong id="user-name" style="color: #fff; display: block; margin-top: 5px; font-size: 1.1rem;">Visitante</strong>
    </div>
    
    <nav>
        <a href="/home" class="<?= $page == 'home' ? 'active' : '' ?>"><i class="fa-solid fa-house"></i> Início</a>
        <a href="/cursos" class="<?= $page === 'cursos' ? 'active' : '' ?>"><i class="fa-solid fa-book"></i> Biblioteca</a>
        <a href="/missoes" class="<?= $page == 'missoes' ? 'active' : '' ?>"><i class="fa-solid fa-crosshairs"></i> Missões</a>
        <!-- <a href="/financeiro" class="<?= $page == 'financeiro' ? 'active' : '' ?>">💰 Financeiro</a>
        <a href="/afiliados" class="<?= $page == 'afiliados' ? 'active' : '' ?>">🤝 Afiliados</a> -->
        <a href="/perfil" class="<?= $page == 'perfil' ? 'active' : '' ?>"><i class="fa-solid fa-gear"></i> Minha Conta</a>
    </nav>

</aside>