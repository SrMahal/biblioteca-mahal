function getAffiliateCode() {
  const params = new URLSearchParams(window.location.search);
  const af = (params.get('af') || '').trim();
  // limita pra evitar lixo/injeção no log/DB (ajuste se quiser)
  if (!af) return null;
  if (af.length > 64) return null;
  return af;
}

document.getElementById('checkoutBibliotecaForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  const msg = document.getElementById('msg');
  const err = document.getElementById('error-msg');

  msg.style.display = 'none';
  err.style.display = 'none';

  if (!nome || nome.length < 2) {
    err.innerText = "Digite seu nome.";
    err.style.display = 'block';
    return;
  }

  // pega ?af=CODIGO da URL
  const afiliado_codigo = getAffiliateCode();

  try {
    msg.innerText = "Gerando checkout...";
    msg.style.display = 'block';

    const r = await fetch('/api/checkout/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        slug: 'biblioteca-mahal',
        afiliado_codigo // <- novo (pode ser null)
      })
    });

    const data = await r.json();

    if (!r.ok) {
      err.innerText = data.message || "Erro ao iniciar checkout.";
      err.style.display = 'block';
      msg.style.display = 'none';
      return;
    }

    window.location.href = data.init_point;

  } catch (e2) {
    console.error(e2);
    err.innerText = "Erro de conexão com o servidor.";
    err.style.display = 'block';
    msg.style.display = 'none';
  }
});
