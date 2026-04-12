document.getElementById('resetPasswordForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = document.getElementById('token')?.value || '';
  const password = document.getElementById('password')?.value || '';
  const password2 = document.getElementById('password2')?.value || '';

  const msg = document.getElementById('msg');
  const errorMsg = document.getElementById('error-msg');

  if (msg) {
    msg.style.display = 'none';
    msg.innerText = '';
  }

  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.innerText = '';
  }

  try {
    const response = await fetch('/api/password/reset', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ token, password, password2 })
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : {};

    if (response.ok) {
      if (msg) {
        msg.innerText = data.message || 'Senha atualizada! Faça login.';
        msg.style.display = 'block';
      }

      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);

      return;
    }

    if (errorMsg) {
      errorMsg.innerText = data.message || data.erro || 'Erro ao atualizar senha.';
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    console.error(err);

    if (errorMsg) {
      errorMsg.innerText = 'Erro de conexão com o servidor.';
      errorMsg.style.display = 'block';
    }
  }
});