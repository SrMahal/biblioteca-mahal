(function () {
    'use strict';

    const slug = String(window.__COURSE_SLUG__ || '');

    function showError(text) {
        document.getElementById('courseLoading')?.style.setProperty('display', 'none');
        const error = document.getElementById('courseError');
        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        document.getElementById('courseLoading')?.style.setProperty('display', 'none');
        document.getElementById('courseError')?.style.setProperty('display', 'none');
        document.getElementById('courseApp')?.style.setProperty('display', 'block');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await window.BMLibrary.ensureAuth();

            const { response, data } = await window.BMLibrary.getJSON(`/api/library/courses/${encodeURIComponent(slug)}`);
            if (!response.ok) {
                showError(data.erro || 'Erro ao carregar curso.');
                return;
            }

            const payload = data.data || {};
            const course = payload.course || {};
            const tracks = payload.tracks || [];
            const modules = payload.modules || [];

            document.getElementById('courseTitle').textContent = course.title || '';
            document.getElementById('courseDescription').textContent = course.description || '';

            if (payload.continue_url) {
                document.getElementById('courseContinueBtn').href = payload.continue_url;
                document.getElementById('courseContinueWrap').style.display = 'block';
            }

            const tracksList = document.getElementById('courseTracksList');
            const tracksEmpty = document.getElementById('courseTracksEmpty');

            if (tracks.length) {
                tracksList.innerHTML = tracks.map((track) => `
          <a class="bm-item" href="/t/${window.BMLibrary.escapeHtml(track.slug)}">
            <div class="bm-item-title">${window.BMLibrary.escapeHtml(track.title || track.slug)}</div>
            <div class="bm-item-desc">${window.BMLibrary.escapeHtml(track.description || '')}</div>
            <div class="bm-item-cta">Abrir trilha →</div>
          </a>
        `).join('');
            } else {
                tracksEmpty.style.display = 'block';
            }

            const modulesList = document.getElementById('courseModulesList');
            const modulesEmpty = document.getElementById('courseModulesEmpty');

            if (modules.length) {
                modulesList.innerHTML = modules.map((m) => `
          <a class="bm-item" href="/m/${window.BMLibrary.escapeHtml(m.slug)}">
            <div class="bm-item-title">${window.BMLibrary.escapeHtml(m.title || m.slug)}</div>
            <div class="bm-item-desc">${window.BMLibrary.escapeHtml(m.description || '')}</div>
            <div class="bm-item-cta">Abrir módulo →</div>
          </a>
        `).join('');
            } else {
                modulesEmpty.style.display = 'block';
            }

            showApp();
        } catch (error) {
            console.error(error);
            showError('Erro de conexão ao carregar curso.');
        }
    });
})();