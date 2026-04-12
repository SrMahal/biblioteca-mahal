(function () {
    'use strict';

    const API_BASE = String(window.MAHAL_API_BASE || window.location.origin || '').replace(/\/$/, '');

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizePath(path) {
        const clean = String(path || '');

        if (clean === '/api/library/courses') return '/api/cursos';
        if (clean === '/api/library/missions') return '/api/missoes';

        const missionMatch = clean.match(/^\/api\/library\/missions\/(\d+)$/);
        if (missionMatch) {
            return `/api/missoes/${missionMatch[1]}`;
        }

        if (clean === '/api/library/profile') return '/api/profile';
        if (clean === '/api/library/auth/me') return '/api/auth/me';
        if (clean === '/api/library/auth/logout') return '/api/logout';

        return clean;
    }

    async function ensureAuth() {
        if (!window.MahalAuth || typeof window.MahalAuth.validateSessionOrRedirect !== 'function') {
            throw new Error('Auth da biblioteca não carregado.');
        }

        const ok = await window.MahalAuth.validateSessionOrRedirect();
        if (!ok) throw new Error('Não autenticado.');
    }

    async function getJSON(path) {
        const finalPath = normalizePath(path);

        const response = await fetch(`${API_BASE}${finalPath}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            if (window.MahalAuth) window.MahalAuth.clearClientAuth();
            window.location.replace('/login');
            throw new Error('401');
        }

        return { response, data };
    }

    async function postJSON(path, payload) {
        const finalPath = normalizePath(path);

        const response = await fetch(`${API_BASE}${finalPath}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload || {})
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            if (window.MahalAuth) window.MahalAuth.clearClientAuth();
            window.location.replace('/login');
            throw new Error('401');
        }

        return { response, data };
    }

    window.BMLibrary = {
        API_BASE,
        escapeHtml,
        ensureAuth,
        getJSON,
        postJSON
    };
})();