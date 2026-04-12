(function () {
    'use strict';

    const lessonSlug = String(window.__LESSON_SLUG__ || '');
    const trackSlug = String(window.__LESSON_TRACK_SLUG__ || '');
    const moduleSlug = String(window.__LESSON_MODULE_SLUG__ || '');

    function buildLessonApiPath() {
        const params = new URLSearchParams();
        if (trackSlug) params.set('track', trackSlug);
        if (moduleSlug) params.set('module', moduleSlug);

        const qs = params.toString();
        return `/api/library/lessons/${encodeURIComponent(lessonSlug)}${qs ? `?${qs}` : ''}`;
    }

    function buildCtxQuery(context) {
        if (!context) return '';
        if (context.type === 'track') return `?track=${encodeURIComponent(context.slug)}`;
        if (context.type === 'module') return `?module=${encodeURIComponent(context.slug)}`;
        return '';
    }

    function renderVideo(lesson) {
        const video = lesson.video || {};
        if (video.embed_html) return video.embed_html;

        if (video.vimeo_id) {
            return `
        <div class="video-embed">
          <iframe
            src="https://player.vimeo.com/video/${window.BMLibrary.escapeHtml(video.vimeo_id)}"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy"></iframe>
        </div>
      `;
        }

        if (video.video_url) {
            return `
        <div class="video-file">
          <video controls preload="metadata">
            <source src="${window.BMLibrary.escapeHtml(video.video_url)}" type="video/mp4">
            Seu navegador não suporta vídeo.
          </video>
        </div>
      `;
        }

        return '<p>Sem vídeo configurado para esta aula.</p>';
    }

    function showError(text) {
        document.getElementById('lessonLoading')?.style.setProperty('display', 'none');
        const error = document.getElementById('lessonError');
        if (error) {
            error.textContent = text;
            error.style.display = 'block';
        }
    }

    function showApp() {
        document.getElementById('lessonLoading')?.style.setProperty('display', 'none');
        document.getElementById('lessonError')?.style.setProperty('display', 'none');
        document.getElementById('lessonApp')?.style.setProperty('display', 'flex');
    }

    async function markTouch(payload) {
        await window.BMLibrary.postJSON('/api/library/progress/touch', payload);
    }

    async function markComplete(payload) {
        return await window.BMLibrary.postJSON('/api/library/progress/complete', payload);
    }

    async function loadLesson() {
        await window.BMLibrary.ensureAuth();

        const { response, data } = await window.BMLibrary.getJSON(buildLessonApiPath());
        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao carregar aula.');
        }

        return data.data || {};
    }

    function bindComplete(data) {
        const context = data.context || null;
        const lesson = data.lesson || {};
        const btn = document.getElementById('lessonComplete');

        if (!context || !btn) return;

        btn.style.display = 'inline-flex';

        btn.addEventListener('click', async () => {
            try {
                const { response, data: resp } = await markComplete({
                    lesson_id: Number(lesson.id),
                    context_type: String(context.type),
                    context_id: Number(context.id)
                });

                if (!response.ok) {
                    alert(resp.erro || 'Erro ao concluir.');
                    return;
                }

                alert('Aula concluída ✅');
            } catch (error) {
                console.error(error);
                alert('Erro de conexão ao concluir.');
            }
        });
    }

    function render(data) {
        const lesson = data.lesson || {};
        const context = data.context || null;
        const timeline = data.timeline || [];
        const prev = data.prev || null;
        const next = data.next || null;

        document.getElementById('lessonTitle').textContent = lesson.title || '';
        document.getElementById('lessonContext').textContent = context
            ? `Contexto: ${context.type} • ${context.title}`
            : '';

        document.getElementById('lessonVideo').innerHTML = renderVideo(lesson);
        document.getElementById('lessonContent').innerHTML = lesson.content_html || '';

        const ctxQuery = buildCtxQuery(context);

        const prevBtn = document.getElementById('lessonPrev');
        const nextBtn = document.getElementById('lessonNext');

        if (prev) {
            prevBtn.href = `/a/${prev.slug}${ctxQuery}`;
            prevBtn.style.display = 'inline-flex';
        }

        if (next) {
            nextBtn.href = `/a/${next.slug}${ctxQuery}`;
            nextBtn.style.display = 'inline-flex';
        }

        const timelineBox = document.getElementById('lessonTimeline');
        if (timelineBox) {
            timelineBox.innerHTML = timeline.map((it) => {
                const active = String(it.slug) === String(lesson.slug);
                return `
          <a href="/a/${window.BMLibrary.escapeHtml(it.slug)}${ctxQuery}"
             class="bm-item bm-timeline-item ${active ? 'is-active' : ''}">
            <div class="bm-item-title">${window.BMLibrary.escapeHtml(it.title)}</div>
          </a>
        `;
            }).join('');
        }

        bindComplete(data);
        showApp();
    }

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const data = await loadLesson();
            render(data);

            if (data.context && data.lesson) {
                await markTouch({
                    lesson_id: Number(data.lesson.id),
                    context_type: String(data.context.type),
                    context_id: Number(data.context.id)
                });
            }
        } catch (error) {
            console.error(error);
            showError(error.message || 'Erro ao carregar aula.');
        }
    });
})();