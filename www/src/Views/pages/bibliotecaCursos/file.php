<section class="content-section">
    <div class="content-header-card">
        <a
            class="curso-back-link"
            href="/curso?path=<?= urlencode($coursePath) ?>"
            id="cursoBackLink"
        >← Voltar</a>

        <h1><?= htmlspecialchars($fileName) ?></h1>
    </div>

    <div class="content-card">
        <?php if (in_array($ext, ['mp4', 'webm', 'mov'], true)): ?>
            <video controls class="curso-video-player" preload="metadata" id="cursoVideoPlayer">
                <source src="<?= htmlspecialchars($streamUrl) ?>" id="cursoVideoSource">
                Seu navegador não suporta vídeo.
            </video>
        <?php elseif ($ext === 'pdf'): ?>
            <iframe src="<?= htmlspecialchars($streamUrl) ?>" class="curso-pdf-frame"></iframe>
        <?php else: ?>
            <p>Preview não disponível para esse formato.</p>
            <a class="curso-local-btn" href="<?= htmlspecialchars($streamUrl) ?>" target="_blank">
                Abrir / baixar arquivo
            </a>
        <?php endif; ?>
    </div>
</section>

<?php if (in_array($ext, ['mp4', 'webm', 'mov'], true)): ?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const backLink = document.getElementById('cursoBackLink');
    const video = document.getElementById('cursoVideoPlayer');
    const source = document.getElementById('cursoVideoSource');

    if (!backLink || !video || !source) return;

    backLink.addEventListener('click', function (event) {
        event.preventDefault();

        const targetUrl = backLink.href;

        try {
            video.pause();
            video.currentTime = 0;

            source.src = '';
            video.removeAttribute('src');
            video.load();
        } catch (error) {
            console.error('Erro ao desmontar vídeo:', error);
        }

        setTimeout(function () {
            window.location.href = targetUrl;
        }, 20);
    });
});
</script>
<?php endif; ?>