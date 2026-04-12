(function () {
    'use strict';

    const slug = String(window.__MODULE_SLUG__ || '');

    function showError(text) {
        document.getElementById('moduleLoading')?.style.setProperty('display', 'none');
        const error = document.getElementById('moduleError');
        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        document.getElementById('moduleLoading')?.style.setProperty('display', 'none');
        document.getElementById('moduleError')?.style.setProperty('display', 'none');
        document.getElementById('moduleApp')?.style.setProperty('display', 'block');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await window.BMLibrary.ensureAuth();

            const { response, data } = await window.BMLibrary.getJSON(`/api/library/modules/${encodeURIComponent(slug)}`);
            if (!response.ok) {
                showError(data.erro || 'Erro ao carregar módulo.');
                return;
            }

            const payload = data.data || {};
            const moduleData = payload.module || {};
            const lessons = payload.lessons || [];

            document.getElementById('moduleTitle').textContent = moduleData.title || moduleData.slug || '';
            document.getElementById('moduleDescription').textContent = moduleData.description || '';

            const list = document.getElementById('moduleLessonsList');
            const empty = document.getElementById('moduleLessonsEmpty');

            if (lessons.length) {
                list.innerHTML = lessons.map((l) => `
          <a class="bm-item" href="/a/${window.BMLibrary.escapeHtml(l.slug)}?module=${encodeURIComponent(moduleData.slug)}">
            <div class="bm-item-title">${window.BMLibrary.escapeHtml(l.title || l.slug)}</div>
            <div class="bm-item-cta">Abrir aula →</div>
          </a>
        `).join('');
            } else {
                empty.style.display = 'block';
            }

            showApp();
        } catch (error) {
            console.error(error);
            showError('Erro de conexão ao carregar módulo.');
        }
    });
})();