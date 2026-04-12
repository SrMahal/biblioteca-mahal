(function () {
    'use strict';

    function showError(text) {
        document.getElementById('coursesLoading')?.style.setProperty('display', 'none');
        const error = document.getElementById('coursesError');
        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        document.getElementById('coursesLoading')?.style.setProperty('display', 'none');
        document.getElementById('coursesError')?.style.setProperty('display', 'none');
        document.getElementById('coursesApp')?.style.setProperty('display', 'block');
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await window.BMLibrary.ensureAuth();

            const { response, data } = await window.BMLibrary.getJSON('/api/library/courses');
            if (!response.ok) {
                showError(data.erro || 'Erro ao carregar cursos.');
                return;
            }

            const courses = data.data?.courses || [];
            const list = document.getElementById('coursesList');
            const empty = document.getElementById('coursesEmpty');

            if (!list) return;

            if (!courses.length) {
                empty.style.display = 'block';
                showApp();
                return;
            }

            list.innerHTML = courses.map((c) => `
        <a href="/c/${window.BMLibrary.escapeHtml(c.slug)}" class="bm-item">
          <div class="bm-item-title">${window.BMLibrary.escapeHtml(c.title)}</div>
          <div class="bm-item-desc">${window.BMLibrary.escapeHtml(c.description || 'Sem descrição.')}</div>
          <div class="bm-item-cta">Abrir curso →</div>
        </a>
      `).join('');

            showApp();
        } catch (error) {
            console.error(error);
            showError('Erro de conexão ao carregar cursos.');
        }
    });
})();