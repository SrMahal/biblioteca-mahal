function getAffiliateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const af = (params.get('af') || '').trim();
  if (!af) return null;
  if (af.length > 64) return null;
  return af;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkoutEventoForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = (document.getElementById('nome')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const cupom = (document.getElementById('cupom')?.value || '').trim();

    const msg = document.getElementById('msg');
    const err = document.getElementById('error-msg');
    const btn = document.getElementById('btnPay');

    if (msg) msg.style.display = 'none';
    if (err) err.style.display = 'none';

    if (!nome || nome.length < 2) {
      if (err) { err.innerText = "Digite seu nome."; err.style.display = 'block'; }
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      if (err) { err.innerText = "E-mail inválido."; err.style.display = 'block'; }
      return;
    }

    const afiliado = cupom || getAffiliateFromUrl();

    try {
      if (btn) btn.setAttribute('disabled', 'disabled');
      if (msg) { msg.innerText = "Gerando checkout..."; msg.style.display = 'block'; }

      const r = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          slug: 'ticket-founder',
          afiliado_codigo: afiliado
        })
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        if (err) { err.innerText = data.message || "Erro ao iniciar checkout."; err.style.display = 'block'; }
        if (msg) msg.style.display = 'none';
        if (btn) btn.removeAttribute('disabled');
        return;
      }

      window.location.href = data.init_point;

    } catch (e2) {
      console.error(e2);
      if (err) { err.innerText = "Erro de conexão com o servidor."; err.style.display = 'block'; }
      if (msg) msg.style.display = 'none';
      if (btn) btn.removeAttribute('disabled');
    }
  });
});
