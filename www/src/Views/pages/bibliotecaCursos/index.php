<section class="content-section">
    <div class="content-header-card">
        <h1>Biblioteca local</h1>
        <p>
            Os cursos são carregados automaticamente da pasta
            <code><?= htmlspecialchars($coursesLabel ?? 'cursos/') ?></code>.
        </p>
        <a href="/extensoes/add-curso/download.php" target="_blank">Adicionar Cursos</a>
    </div>

    <?php if (empty($courses)): ?>
        <div class="content-card">
            <p>
                Nenhum curso encontrado na pasta
                <code><?= htmlspecialchars($coursesLabel ?? 'cursos/') ?></code>.
            </p>
        </div>
    <?php else: ?>
        <div class="cursos-local-grid">
            <?php foreach ($courses as $course): ?>
                <article class="content-card curso-local-card">
                    <h2><?= htmlspecialchars($course['name']) ?></h2>
                    <a class="curso-local-btn" href="/curso?path=<?= urlencode($course['path']) ?>">
                        Abrir curso
                    </a>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>