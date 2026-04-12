(function () {
    'use strict';

    function clearClientAuth() {
        localStorage.removeItem('mahal_token');
        localStorage.removeItem('mahal_user');
    }

    async function validateSessionOrRedirect(checkUrl = '/api/auth/me') {
        try {
            const response = await fetch(checkUrl, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const contentType = response.headers.get('content-type') || '';
            const data = contentType.includes('application/json')
                ? await response.json().catch(() => ({}))
                : {};

            if (!response.ok || !data?.authenticated) {
                clearClientAuth();
                window.location.replace('/login');
                return false;
            }

            if (data?.usuario) {
                localStorage.setItem('mahal_user', JSON.stringify(data.usuario));
            }

            return true;
        } catch (error) {
            console.error('Erro ao validar sessão:', error);
            clearClientAuth();
            window.location.replace('/login');
            return false;
        }
    }

    async function logout() {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            clearClientAuth();
            window.location.href = '/login';
        }
    }

    window.MahalAuth = {
        clearClientAuth,
        validateSessionOrRedirect,
        logout
    };

    window.logout = logout;
})();