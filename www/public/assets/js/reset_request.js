document.getElementById('resetRequestForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email')?.value?.trim() || '';
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
    const response = await fetch('/api/password/forgot', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : {};

    if (response.ok) {
      if (msg) {
        msg.innerText = data.message || 'Se esse e-mail estiver cadastrado, enviaremos um link.';
        msg.style.display = 'block';
      }
      return;
    }

    if (errorMsg) {
      errorMsg.innerText = data.message || data.erro || 'Erro ao solicitar redefinição de senha.';
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