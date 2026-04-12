const API_BASE = (window.MAHAL_API_BASE || '').replace(/\/$/, '');

document.getElementById('resetForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = document.getElementById('token').value.trim();
  const p1 = document.getElementById('password').value;
  const p2 = document.getElementById('password2').value;

  const msg = document.getElementById('msg');
  const err = document.getElementById('error-msg');

  msg.style.display = 'none';
  err.style.display = 'none';

  if (!token) {
    err.innerText = 'Token inválido.';
    err.style.display = 'block';
    return;
  }

  if (p1.length < 8) {
    err.innerText = 'A senha precisa ter pelo menos 8 caracteres.';
    err.style.display = 'block';
    return;
  }

  if (p1 !== p2) {
    err.innerText = 'As senhas não conferem.';
    err.style.display = 'block';
    return;
  }

  try {
    msg.innerText = 'Salvando...';
    msg.style.display = 'block';

    const r = await fetch(`${API_BASE}/api/library/password/reset`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        token,
        password: p1,
        password2: p2
      })
    });

    const contentType = r.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await r.json()
      : null;

    if (!r.ok) {
      err.innerText = data?.message || data?.erro || 'Erro ao redefinir senha.';
      err.style.display = 'block';
      msg.style.display = 'none';
      return;
    }

    msg.innerText = data?.message || 'Senha definida com sucesso. Redirecionando...';

    setTimeout(() => {
      window.location.href = '/login';
    }, 1200);

  } catch (e2) {
    console.error(e2);
    err.innerText = 'Erro de conexão com o servidor.';
    err.style.display = 'block';
    msg.style.display = 'none';
  }
});