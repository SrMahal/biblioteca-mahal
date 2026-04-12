document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';
    const errorMsg = document.getElementById('error-msg');

    if (errorMsg) {
        errorMsg.innerText = '';
        errorMsg.style.display = 'none';
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
            ? await response.json()
            : null;

        if (response.ok) {
            if (data?.token) {
                localStorage.setItem('mahal_token', data.token);
            } else {
                localStorage.removeItem('mahal_token');
            }

            if (data?.usuario) {
                localStorage.setItem('mahal_user', JSON.stringify(data.usuario));
            } else {
                localStorage.removeItem('mahal_user');
            }

            window.location.href = '/home';
            return;
        }

        if (errorMsg) {
            errorMsg.innerText = data?.message || data?.erro || 'Erro ao fazer login';
            errorMsg.style.display = 'block';
        }

    } catch (error) {
        console.error('Erro:', error);

        if (errorMsg) {
            errorMsg.innerText = 'Erro de conexão com o servidor.';
            errorMsg.style.display = 'block';
        }
    }
});