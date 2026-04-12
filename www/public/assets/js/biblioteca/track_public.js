(function () {
    'use strict';

    const slug = String(window.__TRACK_SLUG__ || '');

    function showError(text) {
        document.getElementById('trackLoading')?.style.setProperty('display', 'none');
        const error = document.getElementById('trackError');
        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        document.getElementById('trackLoading')?.style.setProperty('display', 'none');
        document.getElementById('trackError')?.style.setProperty('display', 'none');
        document.getElementById('trackApp')?.style.setProperty('display', 'block');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await window.BMLibrary.ensureAuth();

            const { response, data } = await window.BMLibrary.getJSON(`/api/library/tracks/${encodeURIComponent(slug)}`);
            if (!response.ok) {
                showError(data.erro || 'Erro ao carregar trilha.');
                return;
            }

            const payload = data.data || {};
            const track = payload.track || {};
            const items = payload.items || [];

            document.getElementById('trackTitle').textContent = track.title || track.slug || '';
            document.getElementById('trackDescription').textContent = track.description || '';

            const list = document.getElementById('trackLessonsList');
            const empty = document.getElementById('trackLessonsEmpty');

            if (items.length) {
                list.innerHTML = items.map((it) => `
          <a class="bm-item" href="/a/${window.BMLibrary.escapeHtml(it.slug)}?track=${encodeURIComponent(track.slug)}">
            <div class="bm-item-title">${window.BMLibrary.escapeHtml(it.title || it.slug)}</div>
            <div class="bm-item-cta">Abrir aula →</div>
          </a>
        `).join('');
            } else {
                empty.style.display = 'block';
            }

            showApp();
        } catch (error) {
            console.error(error);
            showError('Erro de conexão ao carregar trilha.');
        }
    });
})();