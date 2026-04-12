document.getElementById('checkoutAfiliadoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const af = (document.getElementById('af')?.value || '').trim(); // codigo_convite ou "5"

  const msg = document.getElementById('msg');
  const err = document.getElementById('error-msg');
  msg.style.display = 'none';
  err.style.display = 'none';

  try {
    msg.innerText = "Gerando checkout...";
    msg.style.display = 'block';

    const res = await fetch('/api/checkout/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nome, email, slug: 'biblioteca-mahal', afiliado_codigo: af })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.style.display = 'none';
      err.innerText = data.message || "Erro ao iniciar checkout.";
      err.style.display = 'block';
      return;
    }

    window.location.href = data.init_point;

  } catch (e2) {
    msg.style.display = 'none';
    err.innerText = "Erro de conexão.";
    err.style.display = 'block';
  }
});
